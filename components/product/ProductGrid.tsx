import React from "react"
import { ProductCard } from "./ProductCard"
import { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 font-body">
        <p className="text-sm text-text-secondary uppercase tracking-widest">
          No luxury items match your selection.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
