"use client"

import React, { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils"
import { Button } from "../ui/Button"
import { useRouter } from "next/navigation"
import { Toast } from "../ui/Toast"

interface CartSummaryProps {
  onClose: () => void
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onClose }) => {
  const router = useRouter()
  const { totalPrice } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode) return
    setLoading(true)

    // Simulate validation against seeded codes
    setTimeout(() => {
      const codeUpper = couponCode.toUpperCase()
      if (codeUpper === "AARU10") {
        if (totalPrice >= 5000) {
          const discountVal = Math.round(totalPrice * 0.1)
          setDiscount(discountVal)
          setAppliedCoupon("AARU10")
          Toast.success("AARU10 Coupon Applied!")
        } else {
          Toast.error("Min order amount for AARU10 is ₹5,000")
        }
      } else if (codeUpper === "WELCOME200") {
        if (totalPrice >= 2000) {
          setDiscount(200)
          setAppliedCoupon("WELCOME200")
          Toast.success("WELCOME200 Coupon Applied!")
        } else {
          Toast.error("Min order amount for WELCOME200 is ₹2,000")
        }
      } else {
        Toast.error("Invalid coupon code")
      }
      setCouponCode("")
      setLoading(false)
    }, 400)
  }

  const shipping = totalPrice > 10000 ? 0 : 250
  const gst = Math.round((totalPrice - discount) * 0.12) // 12% standard GST
  const finalTotal = totalPrice - discount + shipping + gst

  const handleCheckout = () => {
    onClose()
    router.push(`/checkout?coupon=${appliedCoupon || ""}`)
  }

  return (
    <div className="border-t border-border bg-border/10 p-6 space-y-6 font-body text-text-primary">
      {/* Coupon Field */}
      <form onSubmit={handleApplyCoupon} className="flex gap-2">
        <input
          type="text"
          placeholder="DISCOUNT CODE"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 bg-white border border-border px-3 py-2 text-xs uppercase tracking-widest placeholder-text-secondary/50 focus:outline-none focus:border-gold"
        />
        <Button
          type="submit"
          loading={loading}
          variant="outline"
          className="px-4 py-2 text-[10px] h-9"
        >
          Apply
        </Button>
      </form>

      {/* Coupon applied marker */}
      {appliedCoupon && (
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-success">
          <span>Coupon {appliedCoupon} Applied</span>
          <button
            onClick={() => {
              setDiscount(0)
              setAppliedCoupon(null)
            }}
            className="text-text-secondary hover:text-dark underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* Breakdowns */}
      <div className="space-y-2.5 text-xs text-text-secondary border-b border-border/60 pb-4">
        <div className="flex justify-between">
          <span>Bag Subtotal</span>
          <span className="text-dark font-medium">{formatPrice(totalPrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Coupon Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes (12% GST)</span>
          <span className="text-dark font-medium">{formatPrice(gst)}</span>
        </div>
        <div className="flex justify-between">
          <span>Express Delivery</span>
          <span className="text-dark font-medium">
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between items-center text-sm font-semibold tracking-wider uppercase text-dark">
        <span>Order Total</span>
        <span className="font-accent text-lg text-gold font-bold">{formatPrice(finalTotal)}</span>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleCheckout}
        className="w-full h-12 bg-dark text-background hover:bg-gold hover:text-dark uppercase font-semibold text-xs tracking-widest transition-all duration-300"
      >
        Proceed To Checkout
      </Button>
    </div>
  )
}
