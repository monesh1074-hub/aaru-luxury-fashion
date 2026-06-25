"use client"

import React, { useState, useMemo } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { ProductFilters } from "@/components/product/ProductFilters"
import { MobileFilterDrawer, MobileFilterButton } from "@/components/product/MobileFilterDrawer"
import { CollectionBanner } from "@/components/product/CollectionBanner"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useProducts, ProductsInitialData } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { SORT_OPTIONS } from "@/lib/constants"

interface ShopPageContentProps {
  readyToShip?: boolean
  sale?: boolean
  sort?: string
  initialData?: ProductsInitialData
}

export default function ShopPageContent({
  readyToShip,
  sale,
  sort: initialSort = "newest",
  initialData,
}: ShopPageContentProps) {
  const initialFilters = useMemo(
    () => ({
      readyToShip: readyToShip || undefined,
      sale: sale || undefined,
      sort: initialSort,
    }),
    [readyToShip, sale, initialSort]
  )

  const { products, loading, refreshing, error, filters, updateFilters, resetFilters, total, refetch } =
    useProducts(initialFilters, { initialData })
  const { categories } = useCategories()
  const [sort, setSort] = useState(initialSort)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const handleSortChange = (val: string) => {
    setSort(val)
    updateFilters({ sort: val })
    setSortOpen(false)
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.priceMin || filters.priceMax) count++
    if (filters.sizes?.length) count++
    if (filters.fabrics?.length) count++
    if (filters.occasions?.length) count++
    if (filters.colors?.length) count++
    if (filters.readyToShip) count++
    if (filters.sale) count++
    return count
  }, [filters])

  const bannerTitle = filters.readyToShip
    ? "Ready To Ship"
    : filters.sale
    ? "Sale Collection"
    : "Shop All Collections"

  const bannerDescription = filters.readyToShip
    ? "Curated pieces in stock and ready for dispatch within 48 hours."
    : filters.sale
    ? "Exclusive savings on select luxury pieces from the House of AARU."
    : "Explore our complete catalog of heritage sarees, designer couture, lehengas, and bespoke ensembles."

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-28 sm:pt-32 lg:pt-36 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Breadcrumb items={[{ label: "Shop All" }]} />

        <CollectionBanner
          title={bannerTitle}
          description={bannerDescription}
          image="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80"
        />

        <div className="mb-8 md:mb-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <MobileFilterButton onClick={() => setFiltersOpen(true)} activeCount={activeFilterCount} />
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="lg:hidden flex items-center gap-2 border border-border bg-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:border-gold transition-colors"
            >
              Sort
            </button>
            <span className="text-xs text-text-secondary">{total} Items</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="hidden lg:block flex-1 sm:flex-none min-w-[160px] bg-white border border-border px-3 py-2 text-xs focus:outline-none focus:border-gold uppercase tracking-wider font-semibold"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {sortOpen && (
            <div className="lg:hidden border border-border bg-white p-2 space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                    sort === opt.value ? "bg-dark text-background" : "hover:text-gold"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-3 hidden lg:block">
            <ProductFilters filters={filters} onFilterChange={updateFilters} onClearAll={resetFilters} categories={categories} />
          </div>
          <div className="lg:col-span-9">
            <ProductGrid
              products={products}
              loading={loading}
              refreshing={refreshing}
              error={error}
              onRetry={refetch}
              skeletonCount={6}
            />
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
