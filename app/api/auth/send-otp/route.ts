import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit, getRateLimitTimeRemaining } from '@/lib/rateLimiter'

const schema = z.object({
  mobile: z.string().length(10),
  purpose: z.enum(['REGISTER', 'LOGIN', 'PASSWORD_RESET'])
})

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendSMSviaFast2SMS(mobile: string, otp: string): Promise<boolean> {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY
    if (!apiKey) {
      console.error('[Fast2SMS] FAST2SMS_API_KEY is NOT set in environment variables. OTP cannot be sent.')
      return false
    }

    console.log(`[Fast2SMS] Sending OTP to ${mobile}`)

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: mobile,
        flash: 0
      })
    })

    const data = await response.json()
    console.log(`[Fast2SMS] HTTP Status: ${response.status}, Response:`, JSON.stringify(data))

    if (data.return !== true) {
      console.error('[Fast2SMS] Failed to send SMS. Reason:', data.message || data.status || 'Unknown error')
      return false
    }

    return true
  } catch (error) {
    console.error('[Fast2SMS] Exception while sending OTP:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mobile, purpose } = schema.parse(body)

    // Rate limiting: 5 OTP attempts per mobile per hour
    const rateLimitKey = `otp:${mobile}`
    if (!checkRateLimit(rateLimitKey, 5, 3600000)) {
      const remainingMs = getRateLimitTimeRemaining(rateLimitKey, 3600000)
      const remainingMin = Math.ceil(remainingMs / 60000)
      return NextResponse.json(
        {
          success: false,
          message: `Too many OTP attempts. Please try again in ${remainingMin} minute(s).`
        },
        { status: 429 }
      )
    }

    // Find user or create temp user (only for REGISTER)
    let user = await prisma.user.findUnique({ where: { mobile } })
    
    if (!user && purpose === 'REGISTER') {
      // Only create temp user on first registration request
      user = await prisma.user.create({
        data: {
          mobile,
          name: '',
          email: `temp-${mobile}@aaru.local`,
          passwordHash: '',
          role: 'USER',
          isVerified: false,
          isActive: true
        }
      })
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please register first.' },
        { status: 404 }
      )
    }

    // Delete any existing unused OTPs for this mobile+purpose
    await prisma.otpVerification.deleteMany({
      where: {
        userId: user.id,
        purpose,
        isUsed: false
      }
    })

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Save OTP to database
    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otpCode: otp,
        purpose,
        expiresAt,
        isUsed: false
      }
    })

    // Send SMS
    const smsSent = await sendSMSviaFast2SMS(mobile, otp)

    // Development: Log OTP to console for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('===========================================')
      console.log(`OTP for ${mobile}: ${otp}`)
      console.log(`Purpose: ${purpose}`)
      console.log(`Expires: ${expiresAt}`)
      console.log('===========================================')
    }

    if (!smsSent && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to ' + mobile,
      // Only expose OTP in development
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid mobile number format' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
