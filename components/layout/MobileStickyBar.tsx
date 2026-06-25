"use client"

import React from "react"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"

interface MobileStickyBarProps {
  onCartOpen: () => void
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onCartOpen }) => {
  const cartCount = useCartStore((state) => state.totalItems)
  const wishlistCount = useWishlistStore((state) => state.count)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark border-t border-[#262422] safe-area-pb">
      <div className="flex items-center justify-around py-3 px-4">
        <Link
          href="/dashboard/wishlist"
          className="flex flex-col items-center gap-1 text-background/80 hover:text-gold transition-colors relative min-w-[48px] min-h-[48px] justify-center"
          aria-label="Wishlist"
        >
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-wider font-semibold">Wishlist</span>
        </Link>
        <button
          onClick={onCartOpen}
          className="flex flex-col items-center gap-1 text-background/80 hover:text-gold transition-colors relative min-w-[48px] min-h-[48px] justify-center"
          aria-label="Cart"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-wider font-semibold">Cart</span>
        </button>
      </div>
    </div>
  )
}
