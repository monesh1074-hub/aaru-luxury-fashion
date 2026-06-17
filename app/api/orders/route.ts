import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { verifyPaymentSignature } from "@/lib/razorpay"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: "asc" } }
              }
            },
            variant: true
          }
        },
        address: true,
        payments: true,
        shipments: true
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      orders
    })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const {
      addressId,
      items,
      couponCode,
      notes,
      gatewayOrderId,
      gatewayTransactionId,
      gatewaySignature,
      paymentMethod,
    } = await req.json()

    if (!addressId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Address and cart items are required" },
        { status: 400 }
      )
    }

    // If Razorpay details are provided, verify signature and check for replay attacks
    if (gatewayOrderId && gatewayTransactionId && gatewaySignature) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || ""
      const isMockKey = !keySecret || keySecret === "razorpaysecretmock1234567"
      const isMockOrder = gatewayOrderId.startsWith("rzp_mock_order_")

      if (!isMockKey && !isMockOrder) {
        const isValid = verifyPaymentSignature(
          gatewayOrderId,
          gatewayTransactionId,
          gatewaySignature
        )

        if (!isValid) {
          return NextResponse.json(
            { message: "Invalid payment signature" },
            { status: 400 }
          )
        }
      } else {
        console.log("[ORDER] Skipping payment signature check (mock order or mock key)")
      }

      // Check for replay attacks: payment gateway order should not be success already
      const existingPayment = await prisma.payment.findFirst({
        where: {
          gatewayOrderId,
          status: "SUCCESS"
        }
      })

      if (existingPayment) {
        return NextResponse.json(
          { message: "This payment has already been processed for another order" },
          { status: 400 }
        )
      }
    }

    // Validate address ownership
    const address = await prisma.address.findUnique({
      where: { id: addressId }
    })

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      )
    }

    if (address.userId !== user.id) {
      return NextResponse.json(
        { message: "Address not found" },  // Don't leak that address exists
        { status: 404 }
      )
    }

    // Recalculate totals on the server to prevent tamper attempts
    let subtotal = 0
    const resolvedItems: any[] = []

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId, isActive: true },
        include: { variants: true }
      })

      if (!dbProduct) {
        return NextResponse.json(
          { message: `Product not found or unavailable` },
          { status: 404 }
        )
      }

      const dbVariant = dbProduct.variants.find((v) => v.id === item.variantId)

      if (!dbVariant) {
        return NextResponse.json(
          { message: `Product variant not found` },
          { status: 404 }
        )
      }

      if (dbVariant.stockQty < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${dbProduct.name} (Size: ${dbVariant.size}, Color: ${dbVariant.color})` },
          { status: 400 }
        )
      }

      const activePrice = dbProduct.salePrice || dbProduct.basePrice
      const unitPrice = activePrice + dbVariant.additionalPrice
      const itemTotalPrice = unitPrice * item.quantity
      subtotal += itemTotalPrice

      resolvedItems.push({
        productId: dbProduct.id,
        variantId: dbVariant.id,
        productName: dbProduct.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotalPrice
      })
    }

    // Check Coupon if exists
    let discountAmount = 0
    let couponId: string | null = null

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim(), isActive: true }
      })

      if (coupon && new Date(coupon.expiresAt) > new Date() && subtotal >= coupon.minOrderAmount && coupon.usedCount < coupon.maxUses) {
        couponId = coupon.id
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.discountValue) / 100
        } else {
          discountAmount = coupon.discountValue
        }
        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal)
      }
    }

    const discountedTotal = subtotal - discountAmount

    // GST calculation: standard 12% on Indian luxury clothing items
    const gstAmount = parseFloat((discountedTotal * 0.12).toFixed(2))

    // Shipping calculation: Free shipping for orders above ₹5000, otherwise ₹150 flat
    const shippingCharge = discountedTotal > 5000 ? 0 : 150

    const totalAmount = discountedTotal + gstAmount + shippingCharge

    // Generate Order Number
    const orderNumber = `AARU-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Create Order inside database transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          addressId,
          subtotal,
          discountAmount,
          couponId,
          shippingCharge,
          gstAmount,
          totalAmount,
          status: gatewayOrderId ? "PROCESSING" : "PENDING",
          paymentStatus: gatewayOrderId ? "PAID" : "UNPAID",
          notes
        }
      })

      // Add order items
      await tx.orderItem.createMany({
        data: resolvedItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      })

      // Decrement inventory stock
      for (const item of resolvedItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQty: {
              decrement: item.quantity
            }
          }
        })
      }

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: {
            usedCount: {
              increment: 1
            }
          }
        })
      }

      // Empty the database cart items for the user
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      })

      // Create Payment record inside the transaction
      if (gatewayOrderId) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            paymentGateway: "RAZORPAY",
            gatewayOrderId,
            gatewayTransactionId,
            amount: totalAmount,
            currency: "INR",
            status: "SUCCESS",
            method: paymentMethod || "Card/UPI",
            paidAt: new Date()
          }
        })
      }

      // Create tracking notifications
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "ORDER_STATUS",
          title: gatewayOrderId ? "Payment Confirmed & Order Placed" : "Order Placed Successfully",
          message: gatewayOrderId
            ? `Your order ${orderNumber} has been placed and payment is confirmed. We are processing your order!`
            : `Your order ${orderNumber} has been placed. Complete payment to initiate processing.`
        }
      })

      return order
    })

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    }, { status: 201 })

  } catch (error: any) {
    console.error("Order POST error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
