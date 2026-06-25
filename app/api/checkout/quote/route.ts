import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { calculateOrderTotals, resolveCouponDiscount } from "@/lib/orderPricing"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { items, couponCode } = await req.json()
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Cart items are required" }, { status: 400 })
    }

    let subtotal = 0
    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId, isActive: true },
        include: { variants: true },
      })
      if (!dbProduct) {
        return NextResponse.json({ message: "Product unavailable" }, { status: 404 })
      }
      const dbVariant = dbProduct.variants.find((v) => v.id === item.variantId)
      if (!dbVariant) {
        return NextResponse.json({ message: "Variant unavailable" }, { status: 404 })
      }
      if (dbVariant.stockQty < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${dbProduct.name}` },
          { status: 400 }
        )
      }
      const unitPrice = (dbProduct.salePrice || dbProduct.basePrice) + dbVariant.additionalPrice
      subtotal += unitPrice * item.quantity
    }

    let coupon = null
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: String(couponCode).toUpperCase().trim(), isActive: true },
      })
    }

    const discountAmount = resolveCouponDiscount(subtotal, coupon)
    const totals = calculateOrderTotals(subtotal, discountAmount)

    return NextResponse.json({
      success: true,
      couponApplied: discountAmount > 0,
      ...totals,
    })
  } catch (error) {
    console.error("Checkout quote error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
