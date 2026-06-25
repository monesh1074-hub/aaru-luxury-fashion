"use client"

import React, { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product/ProductGrid"
import { useProducts } from "@/hooks/useProducts"
import { Search as SearchIcon, X } from "lucide-react"

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(urlQuery)

  const { products, loading, refreshing, error, updateFilters, setFilters, refetch } = useProducts(
    urlQuery ? { search: urlQuery } : {}
  )

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const applySearch = useCallback(
    (term: string) => {
      const trimmed = term.trim()
      if (trimmed) {
        updateFilters({ search: trimmed })
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      } else {
        setFilters({})
        router.push("/search")
      }
    },
    [router, updateFilters, setFilters]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applySearch(query)
  }

  const handleClear = () => {
    setQuery("")
    setFilters({})
    router.push("/search")
  }

  const handleChange = (value: string) => {
    setQuery(value)
    if (!value.trim()) {
      setFilters({})
      router.replace("/search")
    }
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-28 sm:pt-32 lg:pt-36 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">Discover</span>
          <h1 className="font-display text-3xl font-semibold text-dark">
            {urlQuery ? `Results for "${urlQuery}"` : "Search Collections"}
          </h1>
        </div>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex border border-border bg-white focus-within:border-gold transition-colors">
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search sarees, lehengas, fabrics..."
            className="flex-1 bg-transparent text-sm font-body focus:outline-none placeholder-text-secondary/50 text-dark tracking-wider px-4 py-3"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-text-secondary hover:text-dark transition-colors px-3"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button type="submit" className="text-dark hover:text-gold transition-colors px-4" aria-label="Search">
            <SearchIcon size={20} />
          </button>
        </form>
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
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background min-h-screen pt-32 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-text-secondary">Searching...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
