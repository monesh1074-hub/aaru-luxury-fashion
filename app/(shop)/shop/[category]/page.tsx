"use client"

import React, { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { ProductFilters } from "@/components/product/ProductFilters"
import { MobileFilterDrawer, MobileFilterButton } from "@/components/product/MobileFilterDrawer"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useProducts } from "@/hooks/useProducts"
import axios from "axios"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const catName = params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const { products, loading, filters, updateFilters, resetFilters } = useProducts({ category: params.category })
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: catName }]} />
        <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">Collection</span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-dark">{catName}</h1>
          </div>
          <MobileFilterButton onClick={() => setFiltersOpen(true)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-3 hidden lg:block">
            <ProductFilters filters={filters} onFilterChange={updateFilters} onClearAll={resetFilters} categories={categories} />
          </div>
          <div className="lg:col-span-9">
            <ProductGrid products={products} loading={loading} skeletonCount={6} />
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFilterChange={updateFilters}
        onClearAll={resetFilters}
        categories={categories}
      />
    </div>
  )
}
