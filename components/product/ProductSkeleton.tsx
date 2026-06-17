"use client"

import React from "react"

interface ProductSkeletonProps {
  count?: number
}

const SkeletonCard = () => (
  <div className="group animate-pulse">
    {/* Image placeholder */}
    <div className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4] w-full mb-4" />
    {/* Meta */}
    <div className="space-y-2 px-0.5">
      <div className="h-2.5 bg-[#E8E0D6] rounded-full w-16" />
      <div className="h-3 bg-[#E8E0D6] rounded-full w-4/5" />
      <div className="h-3 bg-[#E8E0D6] rounded-full w-3/5" />
      <div className="h-3.5 bg-[#DFD5CA] rounded-full w-1/3 mt-3" />
    </div>
  </div>
)

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  )
}

export default ProductSkeleton
