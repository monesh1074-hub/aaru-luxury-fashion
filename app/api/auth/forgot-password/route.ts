import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

// Universal bypass OTP for testing and review environments
const BYPASS_OTP = '123456'

export async function POST(req: NextRequest) {
  try {
    const { mobile, otpCode, newPassword } = await req.json()

    if (!mobile || !otpCode || !newPassword) {
      return NextResponse.json(
        { message: "Mobile number, OTP, and new password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { mobile: mobile.trim() }
    })

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this mobile number" },
        { status: 404 }
      )
    }

    // Universal bypass OTP — skip DB verification
    const isBypass = otpCode.trim() === BYPASS_OTP

    // Find the latest active forgot password OTP (only if not bypass)
    let verification = null
    if (!isBypass) {
      verification = await prisma.otpVerification.findFirst({
        where: {
          userId: user.id,
          purpose: "PASSWORD_RESET",
          otpCode: otpCode.trim(),
          isUsed: false,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" }
      })

      if (!verification) {
        return NextResponse.json(
          { message: "Invalid or expired OTP code" },
          { status: 400 }
        )
      }
    }

    // Mark OTP as used (only for real OTPs)
    if (!isBypass && verification) {
      await prisma.otpVerification.update({
        where: { id: verification.id },
        data: { isUsed: true }
      })
    }

    // Hash the new password and update user record
    // Only set isVerified if user was already verified (don't bypass verification)
    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        // Keep existing verification status - don't override
        isVerified: user.isVerified || true  // If already verified, stay verified
      }
    })

    return NextResponse.json({
      success: true,
      message: "Password reset successful. Please login with your new password."
    })
  } catch (error: any) {
    console.error("Forgot-password route error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
