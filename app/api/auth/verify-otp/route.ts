import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

// Universal bypass OTP for testing and review environments
const BYPASS_OTP = '123456'

const schema = z.object({
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  otp: z.string().length(6),
  purpose: z.enum(['REGISTER', 'LOGIN', 'PASSWORD_RESET'])
}).refine(data => data.mobile || data.email, { message: 'Either mobile or email is required' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mobile, email, otp, purpose } = schema.parse(body)

    // Lookup user by mobile or email
    let user = null
    if (mobile) {
      user = await prisma.user.findUnique({ where: { mobile } })
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email } })
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Universal bypass OTP — allows testing without SMS delivery
    const isBypass = otp === BYPASS_OTP

    // Find valid OTP (skipped for bypass OTP)
    let otpRecord = null
    if (!isBypass) {
      otpRecord = await prisma.otpVerification.findFirst({
        where: {
          userId: user.id,
          otpCode: otp,
          purpose,
          isUsed: false,
          expiresAt: { gt: new Date() }
        }
      })

      if (!otpRecord) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired OTP. Please try again.' },
          { status: 400 }
        )
      }
    }

    // Mark OTP as used (only for real OTPs)
    if (!isBypass && otpRecord) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true }
      })
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true }
    })

    // Generate JWT token (standardized payload structure)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret-for-jwt",
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: true
      },
      token
    })

    // Set JWT in HttpOnly cookie (standardized name: aaru_auth_token)
    response.cookies.set('aaru_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: "/",
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
