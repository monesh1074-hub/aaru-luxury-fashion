"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface FilterParams {
  category?: string
  priceMin?: number
  priceMax?: number
  sizes?: string[]
  fabrics?: string[]
  occasions?: string[]
  sort?: string
}

interface ProductFiltersProps {
  filters: FilterParams
  onFilterChange: (newFilters: Partial<FilterParams>) => void
  onClearAll: () => void
  categories: { id: string; name: string; slug: string }[]
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  categories,
}) => {
  const sizes = ["S", "M", "L", "XL", "Free Size", "Unstitched", "Custom Measurement"]
  const fabrics = ["Pure Katan Silk", "Silk Cotton Chanderi", "Kanchipuram Silk", "Pure Georgette", "Plush Silk Velvet", "Organza Silk", "Chanderi Silk", "Organic Modal Silk", "Pure Banarasi Raw Silk", "Jacquard Raw Silk"]
  const occasions = ["Bridal & Weddings", "Festive Wear", "Evening Soiree", "Casual Elegance"]

  const handleCheckboxToggle = (
    field: "sizes" | "fabrics" | "occasions",
    val: string
  ) => {
    const list = filters[field] || []
    const updated = list.includes(val)
      ? list.filter((item) => item !== val)
      : [...list, val]
    onFilterChange({ [field]: updated })
  }

  return (
    <aside className="w-full space-y-10 font-body text-text-primary pr-4">
      {/* 1. Header with Reset */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-display text-sm uppercase font-semibold tracking-wider text-dark">
          Filter By
        </h3>
        <button
          onClick={onClearAll}
          className="text-[10px] uppercase tracking-wider text-text-secondary hover:text-gold font-bold transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      {/* 2. Categories List */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-widest font-semibold text-text-secondary mb-2">
          Category
        </h4>
        <div className="flex flex-col space-y-2.5 text-xs">
          <button
            onClick={() => onFilterChange({ category: "" })}
            className={cn("text-left transition-colors duration-200 hover:text-gold", {
              "text-gold font-bold": !filters.category,
              "text-text-primary": filters.category,
            })}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.slug })}
              className={cn("text-left transition-colors duration-200 hover:text-gold", {
                "text-gold font-bold": filters.category === cat.slug,
                "text-text-primary": filters.category !== cat.slug,
              })}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Price Filter (Double slider or text inputs) */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-widest font-semibold text-text-secondary mb-2">
          Price Range (₹)
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ""}
            onChange={(e) =>
              onFilterChange({ priceMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-1/2 border border-border bg-white px-3 py-2 text-xs focus:outline-none focus:border-gold"
          />
          <span className="text-text-secondary text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ""}
            onChange={(e) =>
              onFilterChange({ priceMax: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-1/2 border border-border bg-white px-3 py-2 text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* 4. Sizes */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-widest font-semibold text-text-secondary mb-2">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((sz) => {
            const isSelected = (filters.sizes || []).includes(sz)
            return (
              <button
                key={sz}
                onClick={() => handleCheckboxToggle("sizes", sz)}
                className={cn(
                  "border px-3 py-2 text-[10px] tracking-wider uppercase transition-all duration-300 font-semibold",
                  {
                    "border-dark bg-dark text-background": isSelected,
                    "border-border text-text-secondary hover:border-gold": !isSelected,
                  }
                )}
              >
                {sz}
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Fabrics */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-widest font-semibold text-text-secondary mb-2">
          Fabric
        </h4>
        <div className="space-y-2 text-xs">
          {fabrics.map((fb) => {
            const isSelected = (filters.fabrics || []).includes(fb)
            return (
              <label key={fb} className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCheckboxToggle("fabrics", fb)}
                  className="rounded-none border-border text-gold focus:ring-gold focus:ring-0 focus:ring-offset-0"
                />
                <span
                  className={cn("text-text-primary hover:text-gold transition-colors duration-200", {
                    "text-gold font-semibold": isSelected,
                  })}
                >
                  {fb}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 6. Occasions */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-widest font-semibold text-text-secondary mb-2">
          Occasion
        </h4>
        <div className="space-y-2 text-xs">
          {occasions.map((oc) => {
            const isSelected = (filters.occasions || []).includes(oc)
            return (
              <label key={oc} className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCheckboxToggle("occasions", oc)}
                  className="rounded-none border-border text-gold focus:ring-gold focus:ring-0 focus:ring-offset-0"
                />
                <span
                  className={cn("text-text-primary hover:text-gold transition-colors duration-200", {
                    "text-gold font-semibold": isSelected,
                  })}
                >
                  {oc}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
