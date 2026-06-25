import { describe, it, expect } from "vitest"
import {
  calculateOrderTotals,
  resolveCouponDiscount,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
} from "./orderPricing"

describe("resolveCouponDiscount", () => {
  const baseCoupon = {
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    minOrderAmount: 1000,
    maxUses: 100,
    usedCount: 0,
    expiresAt: new Date(Date.now() + 86400000),
    isActive: true,
  }

  it("returns 0 for inactive coupon", () => {
    expect(resolveCouponDiscount(5000, { ...baseCoupon, isActive: false })).toBe(0)
  })

  it("applies percentage discount capped at subtotal", () => {
    expect(resolveCouponDiscount(5000, baseCoupon)).toBe(500)
  })

  it("applies fixed discount", () => {
    expect(
      resolveCouponDiscount(5000, { ...baseCoupon, discountType: "FIXED", discountValue: 200 })
    ).toBe(200)
  })
})

describe("calculateOrderTotals", () => {
  it("charges flat shipping below threshold", () => {
    const result = calculateOrderTotals(3000, 0)
    expect(result.shippingCharge).toBe(SHIPPING_FLAT)
    expect(result.gstAmount).toBe(360)
    expect(result.totalAmount).toBe(3000 + 360 + SHIPPING_FLAT)
  })

  it("waives shipping above threshold", () => {
    const result = calculateOrderTotals(FREE_SHIPPING_THRESHOLD + 1, 0)
    expect(result.shippingCharge).toBe(0)
  })
})
