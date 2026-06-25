"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, SlidersHorizontal } from "lucide-react"
import { ProductFilters } from "./ProductFilters"

interface FilterParams {
  category?: string
  priceMin?: number
  priceMax?: number
  sizes?: string[]
  fabrics?: string[]
  occasions?: string[]
  colors?: string[]
  readyToShip?: boolean
  sale?: boolean
  sort?: string
}

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterParams
  onFilterChange: (newFilters: Partial<FilterParams>) => void
  onClearAll: () => void
  categories: { id: string; name: string; slug: string }[]
}

export function MobileFilterButton({
  onClick,
  activeCount = 0,
}: {
  onClick: () => void
  activeCount?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 border border-border bg-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:border-gold transition-colors"
    >
      <SlidersHorizontal size={14} />
      Filters
      {activeCount > 0 && (
        <span className="bg-gold text-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </button>
  )
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  categories,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative w-full max-w-sm h-full bg-background overflow-y-auto z-10 shadow-xl"
          >
            <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider">Filters</h2>
              <button
                onClick={onClose}
                className="p-1 hover:text-gold transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 pb-24">
              <ProductFilters
                filters={filters}
                onFilterChange={onFilterChange}
                onClearAll={onClearAll}
                categories={categories}
              />
            </div>
            <div className="fixed bottom-0 left-0 w-full max-w-sm p-4 bg-background border-t border-border">
              <button
                onClick={onClose}
                className="w-full bg-dark text-background py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold hover:text-dark transition-colors"
              >
                Show Results
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
