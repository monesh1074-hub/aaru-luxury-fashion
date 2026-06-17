"use client"

import React from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useProducts } from "@/hooks/useProducts"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const catName = params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const { products, loading } = useProducts({ category: params.category })

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: catName }]} />
        <div className="mb-10">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">Collection</span>
          <h1 className="font-display text-3xl font-semibold text-dark">{catName}</h1>
        </div>
        <ProductGrid products={products} loading={loading} skeletonCount={6} />
      </div>
    </div>
  )
}
