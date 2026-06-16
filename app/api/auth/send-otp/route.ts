import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit, getRateLimitTimeRemaining } from '@/lib/rateLimiter'
import { sendEmail } from '@/lib/email'

const schema = z.object({
  mobile: z.string().length(10).optional(),
  email: z.string().email().optional(),
  purpose: z.enum(['REGISTER', 'LOGIN', 'PASSWORD_RESET'])
}).refine(data => data.mobile || data.email, {
  message: 'Either mobile or email is required'
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
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { mobile, email, purpose } = parsed.data

    // Rate limiting key — prefer email if provided
    const rateLimitKey = `otp:${email ?? mobile}`
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

    // Find user by email or mobile
    let user = null
    if (email) {
      user = await prisma.user.findUnique({ where: { email } })
    } else if (mobile) {
      user = await prisma.user.findUnique({ where: { mobile } })
    }

    // For REGISTER, create a temp user if not found
    if (!user && purpose === 'REGISTER') {
      user = await prisma.user.create({
        data: {
          mobile: mobile ?? `temp-${Date.now()}`,
          name: '',
          email: email ?? `temp-${mobile}@aaru.local`,
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

    // Delete any existing unused OTPs for this user+purpose
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

    // Development: Log OTP to console for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('===========================================')
      console.log(`OTP for ${email ?? mobile}: ${otp}`)
      console.log(`Purpose: ${purpose}`)
      console.log(`Expires: ${expiresAt}`)
      console.log('===========================================')
    }

    let deliverySuccess = false
    let deliveryChannels: string[] = []

    // Send via Email (SendGrid) if email is provided or if user has an email registered
    const targetEmail = email || (user && user.email && !user.email.startsWith('temp-') ? user.email : null)
    if (targetEmail) {
      const purposeLabel =
        purpose === 'REGISTER'
          ? 'Account Verification'
          : purpose === 'LOGIN'
          ? 'Login Verification'
          : 'Password Reset'

      const emailSent = await sendEmail({
        to: targetEmail,
        subject: `AARU Luxury - ${purposeLabel} OTP`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E8E0D6;">
            <h2 style="color: #0D0D0D; font-family: Playfair Display, serif; text-align: center;">Welcome to AARU</h2>
            <p>Dear User,</p>
            <p>Please use the following One-Time Password (OTP) to complete your ${purposeLabel.toLowerCase()}:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 30px 0; color: #C9A96E;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #7A7369; text-align: center;">This code is valid for 5 minutes. Please do not share it with anyone.</p>
          </div>
        `
      })
      if (emailSent) {
        deliverySuccess = true
        deliveryChannels.push('email')
      }
    }

    // Send via SMS if mobile is provided
    if (mobile) {
      const smsSent = await sendSMSviaFast2SMS(mobile, otp)
      if (smsSent) {
        deliverySuccess = true
        deliveryChannels.push('SMS')
      }
    }

    const deliveryChannel = deliveryChannels.length > 0 ? deliveryChannels.join(' & ') : 'None'


    if (!deliverySuccess && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    const destination = email
      ? email.replace(/(.{2})(.*)(@.*)/, '$1****$3')
      : `+91 ****${mobile?.slice(-4)}`

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${destination}`,
      channel: deliveryChannel,
      // Only expose OTP in development
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input format' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
