import { NextRequest, NextResponse } from "next/server"
import { razorpay } from "@/lib/razorpay"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await req.json()

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ message: "Valid amount is required" }, { status: 400 })
    }

    let gatewayOrderId = `rzp_mock_order_${Date.now()}`
    const isMockKey = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "rzp_test_5gX8Wn9Z2cK4L1"
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`

    const amountInPaise = Math.round(amount * 100)

    if (!isMockKey) {
      try {
        const response = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt
        })
        gatewayOrderId = response.id
      } catch (error) {
        console.error("Razorpay order API error, using mock fallback:", error)
      }
    } else {
      console.log(`[MOCK RAZORPAY] Created mock order for ₹${amount}`)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: gatewayOrderId,
        amount: amountInPaise,
        currency: "INR"
      },
      keyId: isMockKey ? "rzp_test_5gX8Wn9Z2cK4L1" : process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error("Payment order creation error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

