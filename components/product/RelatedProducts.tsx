import React from "react"
import { ProductCard } from "./ProductCard"
import { Product } from "@/types"

interface RelatedProductsProps {
  products: Product[]
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (products.length === 0) return null

  return (
    <div className="space-y-12 font-body text-text-primary">
      <div className="text-center md:text-left">
        <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
          Complete The Look
        </span>
        <h3 className="font-display text-2xl md:text-3xl tracking-wide text-dark">
          Related Products
        </h3>
        <div className="w-12 h-0.5 bg-gold mt-4 block md:hidden mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  )
}
