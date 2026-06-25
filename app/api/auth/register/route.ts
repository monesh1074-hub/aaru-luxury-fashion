import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { sendSMS } from "@/lib/fast2sms"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { name, email, mobile, password } = await req.json()

    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "Name, email, mobile, and password are required" },
        { status: 400 }
      )
    }

    // Check if email or mobile is already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { mobile: mobile.trim() }
        ]
      }
    })

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Clean up unverified, incomplete user record to allow fresh registration
        await prisma.user.delete({ where: { id: existingUser.id } })
      } else {
        return NextResponse.json(
          { error: "Email or mobile number is already registered" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user in transactional state
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        passwordHash,
        isVerified: false,
        role: "USER"
      }
    })

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

    // Save OTP
    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otpCode,
        purpose: "REGISTER",
        expiresAt
      }
    })

    if (process.env.NODE_ENV === "development") {
      console.log("===========================================")
      console.log(`[REGISTER OTP] for ${user.mobile}: ${otpCode}`)
      console.log("===========================================")
    }

    // Dispatch OTP (Fast2SMS & SendGrid)
    await sendSMS(user.mobile, otpCode)
    await sendEmail({
      to: user.email,
      subject: "AARU Luxury - Verify Your Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E8E0D6;">
          <h2 style="color: #0D0D0D; font-family: Playfair Display, serif; text-align: center;">Welcome to AARU</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for registering with AARU Luxury Fashion. Please use the following One-Time Password (OTP) to verify your account:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 30px 0; color: #C9A96E;">
            ${otpCode}
          </div>
          <p style="font-size: 12px; color: #7A7369; text-align: center;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
      `
    })

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. OTP sent.",
        userId: user.id,
        email: user.email,
        mobile: user.mobile
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration route error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
