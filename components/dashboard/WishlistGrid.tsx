import React from "react"
import { WishlistItem } from "@/types"
import { ProductCard } from "../product/ProductCard"

interface WishlistGridProps {
  items: WishlistItem[]
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 font-body text-text-primary">
        <p className="text-sm uppercase tracking-widest text-text-secondary">
          Your wishlist is empty.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <ProductCard key={item.id} product={item.product} />
      ))}
    </div>
  )
}
