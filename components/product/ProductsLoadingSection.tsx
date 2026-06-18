"use client"

import React from "react"
import { ProductSkeleton } from "./ProductSkeleton"

interface ProductsLoadingSectionProps {
  count?: number
  message?: string
  columns?: "2" | "3" | "4"
}

export const ProductsLoadingSection: React.FC<ProductsLoadingSectionProps> = ({
  count = 6,
  message = "Loading collections...",
  columns = "3",
}) => {
  const gridCols =
    columns === "4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : columns === "2"
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin shrink-0" />
        <p className="text-xs uppercase tracking-widest text-text-secondary font-body">{message}</p>
      </div>
      <div className={`grid ${gridCols} gap-6`}>
        <ProductSkeleton count={count} />
      </div>
    </div>
  )
}

export default ProductsLoadingSection
