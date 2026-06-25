"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Search, Loader2, X } from "lucide-react"
import axios from "axios"
import { POPULAR_SEARCHES } from "@/lib/constants"
import { formatPrice, cn } from "@/lib/utils"

interface SearchProduct {
  id: string
  name: string
  slug: string
  basePrice: number
  salePrice?: number | null
  category?: { slug: string; name: string }
  images?: { imageUrl: string; isPrimary?: boolean }[]
}

interface NavbarSearchProps {
  variant?: "light" | "dark"
  className?: string
  onNavigate?: () => void
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  variant = "light",
  className,
  onNavigate,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchProduct[]>([])

  const isDark = variant === "dark"

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setResults([])
    inputRef.current?.blur()
  }, [])

  // Close dropdown when navigating — prevents overlay blocking SecondaryNav clicks
  useEffect(() => {
    closeSearch()
    setQuery("")
  }, [pathname, closeSearch])

  const fetchSuggestions = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await axios.get(`/api/products?search=${encodeURIComponent(term.trim())}&limit=6`)
      setResults(res.data.products || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) fetchSuggestions(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, isOpen, fetchSuggestions])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeSearch()
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch()
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [closeSearch])

  const goToSearch = (term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    closeSearch()
    setQuery("")
    onNavigate?.()
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    goToSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const handleSelectProduct = () => {
    closeSearch()
    setQuery("")
    onNavigate?.()
  }

  const showPopular = isOpen && !query.trim()
  const showResults = isOpen && query.trim().length > 0

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search"
          className={cn(
            "w-full h-10 pl-4 pr-16 text-sm font-body tracking-wide focus:outline-none transition-colors duration-300",
            isDark
              ? "bg-white/10 border border-white/25 text-white placeholder-white/50 focus:border-gold"
              : "bg-white border border-border text-text-primary placeholder-text-secondary/60 focus:border-gold"
          )}
          aria-label="Search products"
          aria-autocomplete="list"
          autoComplete="off"
        />
        <div className="absolute right-0 top-0 h-10 flex items-center">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "h-10 w-8 flex items-center justify-center transition-colors",
                isDark ? "text-white/70 hover:text-white" : "text-text-secondary hover:text-dark"
              )}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="submit"
            className={cn(
              "h-10 w-10 flex items-center justify-center transition-colors",
              isDark ? "text-white/70 hover:text-gold" : "text-text-secondary hover:text-gold"
            )}
            aria-label="Submit search"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border shadow-xl z-[45] max-h-[min(420px,60vh)] overflow-y-auto">
          {showPopular && (
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary mb-3">
                Popular Searches
              </p>
              <ul className="space-y-1">
                {POPULAR_SEARCHES.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        closeSearch()
                        onNavigate?.()
                      }}
                      className="block px-3 py-2.5 text-sm text-text-primary hover:bg-[#F5F0EA] hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showResults && !loading && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-text-secondary text-center">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {showResults && results.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary">
                Products
              </p>
              <ul>
                {results.map((product) => {
                  const imageUrl =
                    product.images?.find((img) => img.isPrimary)?.imageUrl ||
                    product.images?.[0]?.imageUrl ||
                    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=100&q=80"
                  const categorySlug = product.category?.slug || "shop"
                  const price = product.salePrice || product.basePrice

                  return (
                    <li key={product.id}>
                      <Link
                        href={`/shop/${categorySlug}/${product.slug}`}
                        onClick={handleSelectProduct}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EA] transition-colors group"
                      >
                        <div className="relative w-12 h-14 flex-shrink-0 bg-border/30 overflow-hidden">
                          <Image src={imageUrl} alt={product.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate group-hover:text-gold transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">
                            {product.category?.name || "Collection"}
                          </p>
                        </div>
                        <span className="text-sm font-accent text-gold font-semibold flex-shrink-0">
                          {formatPrice(price)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <button
                type="button"
                onClick={() => goToSearch(query)}
                className="w-full px-4 py-3 text-xs uppercase tracking-widest font-semibold text-gold border-t border-border hover:bg-[#F5F0EA] transition-colors text-left"
              >
                View all results for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
