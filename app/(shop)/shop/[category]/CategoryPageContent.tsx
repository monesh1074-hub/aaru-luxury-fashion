"use client"

import React, { useMemo } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { ProductFilters } from "@/components/product/ProductFilters"
import { MobileFilterDrawer, MobileFilterButton } from "@/components/product/MobileFilterDrawer"
import { CollectionBanner } from "@/components/product/CollectionBanner"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { useProducts, ProductsInitialData } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { COLLECTION_BANNERS } from "@/lib/constants"
import { resolveCategorySlug } from "@/lib/categorySlugs"

interface CategoryPageContentProps {
  category: string
  readyToShip?: boolean
  sale?: boolean
  initialData?: ProductsInitialData
}

export default function CategoryPageContent({
  category,
  readyToShip,
  sale,
  initialData,
}: CategoryPageContentProps) {
  const resolvedCategory = resolveCategorySlug(category)
  const catName = resolvedCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  const initialFilters = useMemo(
    () => ({
      category: resolvedCategory,
      readyToShip: readyToShip || undefined,
      sale: sale || undefined,
    }),
    [resolvedCategory, readyToShip, sale]
  )

  const { products, loading, refreshing, error, filters, updateFilters, resetFilters, refetch } =
    useProducts(initialFilters, { initialData })

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category?.slug === resolvedCategory),
    [products, resolvedCategory]
  )
  const { categories } = useCategories()
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const banner = COLLECTION_BANNERS[resolvedCategory] || {
    title: catName,
    description: `Discover our curated ${catName.toLowerCase()} collection, crafted with heritage techniques and modern luxury aesthetics.`,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceMin || filters.priceMax) count++
    if (filters.sizes?.length) count++
    if (filters.fabrics?.length) count++
    if (filters.occasions?.length) count++
    if (filters.colors?.length) count++
    if (filters.readyToShip) count++
    if (filters.sale) count++
    return count
  }, [filters])

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-28 sm:pt-32 lg:pt-36 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: catName }]} />

        <CollectionBanner title={banner.title} description={banner.description} image={banner.image} />

        <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">Collection</span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-dark">{catName}</h1>
          </div>
          <MobileFilterButton onClick={() => setFiltersOpen(true)} activeCount={activeFilterCount} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-3 hidden lg:block">
            <ProductFilters filters={filters} onFilterChange={updateFilters} onClearAll={resetFilters} categories={categories} />
          </div>
          <div className="lg:col-span-9">
            <ProductGrid
              products={categoryProducts}
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
