/** Single source of truth for checkout totals — used by API and client quote. */

export const GST_RATE = 0.12
export const SHIPPING_FLAT = 150
export const FREE_SHIPPING_THRESHOLD = 5000

export interface CouponInput {
  discountType: string
  discountValue: number
  minOrderAmount: number
  maxUses: number
  usedCount: number
  expiresAt: Date | string
  isActive: boolean
}

export function resolveCouponDiscount(
  subtotal: number,
  coupon: CouponInput | null | undefined
): number {
  if (!coupon || !coupon.isActive) return 0
  if (new Date(coupon.expiresAt) <= new Date()) return 0
  if (subtotal < coupon.minOrderAmount) return 0
  if (coupon.usedCount >= coupon.maxUses) return 0

  let discount =
    coupon.discountType === "PERCENTAGE"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue

  return Math.min(Math.max(0, discount), subtotal)
}

export function calculateOrderTotals(subtotal: number, discountAmount: number) {
  const discountedTotal = Math.max(0, subtotal - discountAmount)
  const gstAmount = parseFloat((discountedTotal * GST_RATE).toFixed(2))
  const shippingCharge = discountedTotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
  const totalAmount = parseFloat((discountedTotal + gstAmount + shippingCharge).toFixed(2))

  return {
    subtotal,
    discountAmount,
    discountedTotal,
    gstAmount,
    shippingCharge,
    totalAmount,
  }
}
