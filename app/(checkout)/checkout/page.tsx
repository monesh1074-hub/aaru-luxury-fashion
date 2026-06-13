"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AddressStep } from "@/components/checkout/AddressStep"
import { PaymentStep } from "@/components/checkout/PaymentStep"
import { OrderReview } from "@/components/checkout/OrderReview"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"
import { Toast } from "@/components/ui/Toast"
import { cn } from "@/lib/utils"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const couponCode = searchParams.get("coupon") || undefined
  const { items } = useCart()
  const { createOrder } = useOrders()
  const [step, setStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [paymentDetails, setPaymentDetails] = useState<{ gatewayOrderId: string; gatewayTransactionId: string; gatewaySignature: string; paymentMethod: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handlePaymentSuccess = (gatewayOrderId: string, gatewayTransactionId: string, gatewaySignature: string, paymentMethod: string) => {
    setPaymentDetails({ gatewayOrderId, gatewayTransactionId, gatewaySignature, paymentMethod })
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!paymentDetails || !selectedAddressId) return
    setSubmitting(true)
    try {
      const order = await createOrder({
        addressId: selectedAddressId,
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        couponCode,
        gatewayOrderId: paymentDetails.gatewayOrderId,
        gatewayTransactionId: paymentDetails.gatewayTransactionId,
        gatewaySignature: paymentDetails.gatewaySignature,
        paymentMethod: paymentDetails.paymentMethod,
      })
      Toast.success("Order placed successfully!")
      router.push(`/order-success/${order.id}`)

    } catch (err: any) {
      Toast.error(err.message || "Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { num: 1, label: "Address" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Review" },
  ]

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-10">
        <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-semibold text-dark">Checkout</h1>
          <div className="flex justify-center gap-8 pt-4">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center space-x-2">
                <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all", step >= s.num ? "border-gold bg-gold text-dark" : "border-border text-text-secondary")}>{s.num}</span>
                <span className={cn("text-xs uppercase tracking-wider font-semibold hidden sm:block", step >= s.num ? "text-dark" : "text-text-secondary")}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-border p-6 md:p-10">
          {step === 1 && <AddressStep onNext={(addressId) => { setSelectedAddressId(addressId); setStep(2) }} />}
          {step === 2 && <PaymentStep couponCode={couponCode} onPaymentSuccess={handlePaymentSuccess} onPrev={() => setStep(1)} />}
          {step === 3 && <OrderReview couponCode={couponCode} paymentDetails={paymentDetails} onSubmit={handlePlaceOrder} loading={submitting} />}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body text-text-secondary text-sm">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
