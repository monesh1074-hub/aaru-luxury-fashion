"use client"

import React, { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { Button } from "../ui/Button"
import { formatPrice } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Toast } from "../ui/Toast"
import axios from "axios"

interface PaymentStepProps {
  couponCode?: string
  onPaymentSuccess: (
    gatewayOrderId: string,
    gatewayTransactionId: string,
    gatewaySignature: string,
    paymentMethod: string
  ) => void
  onPrev: () => void
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  couponCode,
  onPaymentSuccess,
  onPrev,
}) => {
  const { totalPrice } = useCart()
  const { token, user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  // Calculations
  let discount = 0
  if (couponCode === "AARU10" && totalPrice >= 5000) discount = Math.round(totalPrice * 0.1)
  if (couponCode === "WELCOME200" && totalPrice >= 2000) discount = 200

  const shipping = totalPrice > 10000 ? 0 : 250
  const gst = Math.round((totalPrice - discount) * 0.12)
  const finalTotal = totalPrice - discount + shipping + gst

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  };

  const handlePayment = async () => {
    setLoading(true)
    try {
      // 1. Create order on server
      const orderRes = await axios.post(
        "/api/payments/create-order",
        { amount: finalTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!orderRes.data.success) {
        throw new Error("Failed to create Razorpay Order")
      }

      const { id: gatewayOrderId, amount, currency } = orderRes.data.order
      const keyId = orderRes.data.keyId

      // 2. Load SDK script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        Toast.error("Razorpay SDK failed to load. Check your internet connection.")
        setLoading(false)
        return
      }

      // Detect mock order (no real Razorpay key configured)
      const isMockOrder = !gatewayOrderId || gatewayOrderId.startsWith("rzp_mock_order_")

      // 3. Open Razorpay widget modal
      const options: any = {
        key: isMockOrder ? "rzp_test_5gX8Wn9Z2cK4L1" : (keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
        amount,
        currency,
        name: "AARU Luxury",
        description: "Bespoke Indian Fashion",
        // Only pass order_id for real orders — mock orders omit it so the SDK opens freely
        ...(isMockOrder ? {} : { order_id: gatewayOrderId }),
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        // Ensure UPI is displayed prominently
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi" }
                ]
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" }
                ]
              }
            },
            sequence: ["block.upi", "block.other"],
            preferences: { show_default_blocks: false }
          }
        },
        theme: {
          color: "#C9A96E",
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post(
              "/api/payments/verify",
              {
                razorpay_order_id: isMockOrder ? gatewayOrderId : response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || `sig_mock_${Date.now()}`,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )

            if (verifyRes.data.success) {
              Toast.success("Payment authorized successfully!")
              onPaymentSuccess(
                isMockOrder ? gatewayOrderId : response.razorpay_order_id,
                response.razorpay_payment_id || `pay_mock_${Date.now()}`,
                response.razorpay_signature || `sig_mock_${Date.now()}`,
                response.method || "Card/UPI"
              )
            } else {
              Toast.error("Payment verification failed.")
            }
          } catch (err) {
            console.error(err)
            Toast.error("Server authentication of payment failed.")
          }
        },
        modal: {
          ondismiss: () => {
            Toast.info("Payment window dismissed.")
            setLoading(false)
          },
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (error: any) {
      console.error(error)
      Toast.error(error.message || "Razorpay initialization failed.")
      setLoading(false)
    }
  }


  return (
    <div className="space-y-8 font-body text-text-primary">
      <div>
        <h3 className="font-display text-lg font-semibold uppercase tracking-wider mb-2">
          Payment Method
        </h3>
        <p className="text-xs text-text-secondary">
          Initiate payments via Razorpay (UPI, Credit/Debit Card, NetBanking, Wallets).
        </p>
      </div>

      <div className="border border-border p-5 space-y-4 bg-border/5">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-secondary border-b border-border/60 pb-2.5">
          Order Payment Summary
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Coupon Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes (12% GST)</span>
            <span className="font-medium">{formatPrice(gst)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          <hr className="border-border/60 my-1" />
          <div className="flex justify-between text-sm font-semibold uppercase tracking-wide">
            <span>Total Payable</span>
            <span className="font-accent text-gold font-bold">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onPrev} className="w-1/2" disabled={loading}>
          Back to Address
        </Button>
        <Button onClick={handlePayment} loading={loading} className="w-1/2">
          Pay with Razorpay
        </Button>
      </div>
    </div>
  )
}
