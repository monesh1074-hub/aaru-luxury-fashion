"use client"

import React, { useState, useEffect, useMemo } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { ProductFilters } from "@/components/product/ProductFilters"
import { MobileFilterDrawer, MobileFilterButton } from "@/components/product/MobileFilterDrawer"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useProducts } from "@/hooks/useProducts"
import axios from "axios"

export default function ShopPage() {
  const { products, loading, filters, updateFilters, resetFilters, total } = useProducts()
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [sort, setSort] = useState("newest")
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  const handleSortChange = (val: string) => {
    setSort(val)
    updateFilters({ sort: val })
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.priceMin || filters.priceMax) count++
    if (filters.sizes?.length) count++
    if (filters.fabrics?.length) count++
    if (filters.occasions?.length) count++
    return count
  }, [filters])

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Breadcrumb items={[{ label: "Shop All" }]} />

        <div className="mb-8 md:mb-10 flex flex-col gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">Curated Catalog</span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-dark">Shop All Collections</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MobileFilterButton onClick={() => setFiltersOpen(true)} activeCount={activeFilterCount} />
            <span className="text-xs text-text-secondary">{total} Items</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 sm:flex-none min-w-[140px] bg-white border border-border px-3 py-2 text-xs focus:outline-none focus:border-gold uppercase tracking-wider font-semibold"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
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
