import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json()

    if (!code || orderAmount === undefined) {
      return NextResponse.json(
        { message: "Coupon code and order amount are required" },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() }
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { message: "Invalid coupon code" },
        { status: 400 }
      )
    }

    // Check expiry date
    if (new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { message: "Coupon code has expired" },
        { status: 400 }
      )
    }

    // Check minimum order amount requirement
    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { message: `Minimum order amount of ₹${coupon.minOrderAmount} is required to use this coupon` },
        { status: 400 }
      )
    }

    // Check usage limits
    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { message: "Coupon usage limit has been reached" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    })
  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
