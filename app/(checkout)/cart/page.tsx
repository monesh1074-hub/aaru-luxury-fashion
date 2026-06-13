"use client"

import React from "react"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { CartItem } from "@/components/cart/CartItem"
import { CartSummary } from "@/components/cart/CartSummary"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, totalItems, updateQuantity, removeItem } = useCart()

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Shopping Cart" }]} />

        <div className="mb-12 border-b border-border pb-6">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
            Your Selection
          </span>
          <h1 className="font-display text-3xl font-semibold text-dark">
            Shopping Cart ({totalItems})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border bg-white space-y-6 max-w-lg mx-auto">
            <ShoppingBag size={48} className="text-border mx-auto animate-pulse" />
            <p className="text-sm uppercase tracking-widest text-text-secondary">
              Your shopping bag is empty.
            </p>
            <Link
              href="/shop"
              className="bg-dark text-background px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gold hover:text-dark transition-all duration-300 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items List (Left) */}
            <div className="lg:col-span-8 bg-white border border-border p-6 md:p-8 space-y-6">
              {items.map((item) => (
                <CartItem
                  key={item.id || `${item.productId}-${item.variantId}`}
                  item={item}
                  onUpdateQty={(qty) => updateQuantity(item.productId, item.variantId, qty)}
                  onRemove={() => removeItem(item.productId, item.variantId)}
                />
              ))}
            </div>

            {/* Totals Summary (Right) */}
            <div className="lg:col-span-4">
              <CartSummary onClose={() => {}} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
