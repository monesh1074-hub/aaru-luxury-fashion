import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { verifyPaymentSignature } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification fields' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
    const isMockKey = !keySecret || keySecret === 'razorpaysecretmock1234567'
    const isMockOrder = !razorpay_order_id || razorpay_order_id.startsWith('rzp_mock_order_')

    if (!isMockKey && !isMockOrder) {
      const isValid = verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid payment signature' },
          { status: 400 }
        )
      }
    } else {
      console.log('[PAYMENT VERIFY] Skipping signature check (mock order or mock key)')
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully'
    })
  } catch (error) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

