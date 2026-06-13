"use client"

import React, { useState } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { useProducts } from "@/hooks/useProducts"
import { Search as SearchIcon } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const { products, loading, updateFilters } = useProducts()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: query })
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">Discover</span>
          <h1 className="font-display text-3xl font-semibold text-dark">Search Collections</h1>
        </div>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex border-b-2 border-dark focus-within:border-gold transition-colors py-3">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sarees, lehengas, fabrics..." className="flex-1 bg-transparent text-sm font-body focus:outline-none placeholder-text-secondary/50 text-dark tracking-wider" />
          <button type="submit" className="text-dark hover:text-gold transition-colors" aria-label="Search">
            <SearchIcon size={20} />
          </button>
        </form>
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
