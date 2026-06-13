import Razorpay from "razorpay"
import * as crypto from "crypto"

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_5gX8Wn9Z2cK4L1",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "razorpaysecretmock1234567",
})

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || "razorpaysecretmock1234567"
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  return generatedSignature === signature
}
