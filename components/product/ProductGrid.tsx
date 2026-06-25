import React from "react"
import { ProductCard } from "./ProductCard"
import { ProductsLoadingSection } from "./ProductsLoadingSection"
import { ProductSkeleton } from "./ProductSkeleton"
import { Product } from "@/types"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  refreshing?: boolean
  skeletonCount?: number
  error?: string | null
  onRetry?: () => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  refreshing = false,
  skeletonCount = 8,
  error = null,
  onRetry,
}) => {
  if (loading && products.length === 0) {
    return <ProductsLoadingSection count={skeletonCount} showSpinner={false} />
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-20 font-body space-y-4">
        <p className="text-sm text-text-secondary uppercase tracking-widest">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs uppercase tracking-widest font-semibold text-gold hover:text-dark transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

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
    <div className="relative">
      {refreshing && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none">
          <div className="mt-2 h-1 w-24 rounded-full bg-border/40 overflow-hidden">
            <div className="h-full w-1/2 bg-gold animate-pulse rounded-full" />
          </div>
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200",
          refreshing && "opacity-70"
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {refreshing && products.length < skeletonCount && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 opacity-40">
          <ProductSkeleton count={Math.min(3, skeletonCount - products.length)} />
        </div>
      )}
    </div>
  )
}
