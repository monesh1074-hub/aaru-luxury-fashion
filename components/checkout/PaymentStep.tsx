"use client"

import React, { useState, useEffect } from "react"
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

interface Quote {
  subtotal: number
  discountAmount: number
  gstAmount: number
  shippingCharge: number
  totalAmount: number
  couponApplied: boolean
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  couponCode,
  onPaymentSuccess,
  onPrev,
}) => {
  const { items } = useCart()
  const { token, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(true)
  const [quote, setQuote] = useState<Quote | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      setQuote(null)
      setQuoteLoading(false)
      return
    }

    let cancelled = false
    setQuoteLoading(true)

    axios
      .post(
        "/api/checkout/quote",
        {
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          couponCode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (!cancelled) setQuote(res.data)
      })
      .catch(() => {
        if (!cancelled) Toast.error("Unable to calculate order total")
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [items, couponCode, token])

  const finalTotal = quote?.totalAmount ?? 0
  const discount = quote?.discountAmount ?? 0
  const gst = quote?.gstAmount ?? 0
  const shipping = quote?.shippingCharge ?? 0
  const subtotal = quote?.subtotal ?? 0

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!quote) {
      Toast.error("Order total is not ready yet")
      return
    }

    setLoading(true)
    try {
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

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        Toast.error("Razorpay SDK failed to load. Check your internet connection.")
        setLoading(false)
        return
      }

      const isMockOrder = !gatewayOrderId || gatewayOrderId.startsWith("rzp_mock_order_")

      const options: Record<string, unknown> = {
        key: isMockOrder ? "rzp_test_5gX8Wn9Z2cK4L1" : (keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
        amount,
        currency,
        name: "AARU Luxury",
        description: "Bespoke Indian Fashion",
        ...(isMockOrder ? {} : { order_id: gatewayOrderId }),
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: { show_default_blocks: false },
          },
        },
        theme: { color: "#C9A96E" },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id?: string
          razorpay_signature?: string
          method?: string
        }) => {
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

      const RazorpayCtor = (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay
      const paymentObject = new RazorpayCtor(options)
      paymentObject.open()
    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : "Razorpay initialization failed."
      Toast.error(message)
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
        {quoteLoading ? (
          <p className="text-xs text-text-secondary">Calculating totals...</p>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
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
        )}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onPrev} className="w-1/2" disabled={loading}>
          Back to Address
        </Button>
        <Button
          onClick={handlePayment}
          loading={loading}
          className="w-1/2"
          disabled={quoteLoading || !quote}
        >
          Pay with Razorpay
        </Button>
      </div>
    </div>
  )
}
