"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { CartItem } from "./CartItem"
import { CartSummary } from "./CartSummary"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, totalItems, updateQuantity, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-body">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          {/* Sliding Cart Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="relative w-full max-w-md h-full bg-background border-l border-border flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Header section */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag size={18} className="text-gold" />
                <h3 className="font-display text-base font-semibold uppercase tracking-wider text-dark">
                  Shopping Cart ({totalItems})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-dark transition-colors duration-200"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items scroll zone */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={36} className="text-border/60" />
                  <p className="text-xs uppercase tracking-widest text-text-secondary">
                    Your shopping bag is empty.
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="bg-dark text-background px-6 py-3 text-[10px] tracking-widest uppercase font-semibold hover:bg-gold hover:text-dark transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.id || `${item.productId}-${item.variantId}`}
                    item={item}
                    onUpdateQty={(qty) => updateQuantity(item.productId, item.variantId, qty)}
                    onRemove={() => removeItem(item.productId, item.variantId)}
                  />
                ))
              )}
            </div>

            {/* Summary details */}
            {items.length > 0 && <CartSummary onClose={onClose} />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
