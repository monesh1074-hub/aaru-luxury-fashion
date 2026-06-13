import React from "react"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils"
import { Button } from "../ui/Button"

interface OrderReviewProps {
  couponCode?: string
  paymentDetails: {
    gatewayOrderId: string
    gatewayTransactionId: string
    paymentMethod: string
  } | null
  onSubmit: () => void
  loading: boolean
}

export const OrderReview: React.FC<OrderReviewProps> = ({
  couponCode,
  paymentDetails,
  onSubmit,
  loading,
}) => {
  const { items, totalPrice } = useCart()

  let discount = 0
  if (couponCode === "AARU10" && totalPrice >= 5000) discount = Math.round(totalPrice * 0.1)
  if (couponCode === "WELCOME200" && totalPrice >= 2000) discount = 200

  const shipping = totalPrice > 10000 ? 0 : 250
  const gst = Math.round((totalPrice - discount) * 0.12)
  const finalTotal = totalPrice - discount + shipping + gst

  return (
    <div className="space-y-8 font-body text-text-primary">
      <div>
        <h3 className="font-display text-lg font-semibold uppercase tracking-wider mb-2">
          Review & Confirm
        </h3>
        <p className="text-xs text-text-secondary">
          Review your items and click place order to complete.
        </p>
      </div>

      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
        {items.map((item) => {
          const itemPrice = item.product.salePrice || item.product.basePrice
          return (
            <div
              key={item.id || `${item.productId}-${item.variantId}`}
              className="flex justify-between items-center text-xs border-b border-border/55 pb-3"
            >
              <div>
                <span className="font-semibold uppercase block">{item.product.name}</span>
                <span className="text-[10px] text-text-secondary">
                  Qty: {item.quantity} | Size: {item.variant.size} | Color: {item.variant.color}
                </span>
              </div>
              <span className="font-accent text-dark font-medium">
                {formatPrice((itemPrice + item.variant.additionalPrice) * item.quantity)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="space-y-2 text-xs border-t border-border pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Coupon Discount ({couponCode})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes (12% GST)</span>
          <span>{formatPrice(gst)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
        </div>
        <hr className="border-border/60 my-1" />
        <div className="flex justify-between text-sm font-semibold uppercase tracking-wider">
          <span>Final Total</span>
          <span className="font-accent text-gold text-lg font-bold">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {paymentDetails && (
        <div className="p-4 bg-success/5 border border-success/30 text-[10px] uppercase tracking-wider text-success">
          <span>Payment Authorized via {paymentDetails.paymentMethod}</span>
          <br />
          <span className="text-[9px] text-text-secondary">
            Ref ID: {paymentDetails.gatewayTransactionId}
          </span>
        </div>
      )}

      <Button onClick={onSubmit} loading={loading} className="w-full h-12">
        Place Order & Generate Invoice
      </Button>
    </div>
  )
}
