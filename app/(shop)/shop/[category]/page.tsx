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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (<div key={i} className="animate-pulse bg-border/30 aspect-[3/4]" />))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
