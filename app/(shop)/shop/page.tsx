"use client"

import React, { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { ProductFilters } from "@/components/product/ProductFilters"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useProducts } from "@/hooks/useProducts"
import axios from "axios"

export default function ShopPage() {
  const { products, loading, filters, updateFilters, resetFilters, total } = useProducts()
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [sort, setSort] = useState("newest")

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  const handleSortChange = (val: string) => {
    setSort(val)
    updateFilters({ sort: val })
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Shop All" }]} />

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">Curated Catalog</span>
            <h1 className="font-display text-3xl font-semibold text-dark">Shop All Collections</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-secondary">{total} Items</span>
            <select value={sort} onChange={(e) => handleSortChange(e.target.value)} className="bg-white border border-border px-3 py-2 text-xs focus:outline-none focus:border-gold uppercase tracking-wider font-semibold">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3 hidden lg:block">
            <ProductFilters filters={filters} onFilterChange={updateFilters} onClearAll={resetFilters} categories={categories} />
          </div>
          <div className="lg:col-span-9">
            <ProductGrid products={products} loading={loading} skeletonCount={6} />
          </div>
        </div>
      </div>
    </div>
  )
}
