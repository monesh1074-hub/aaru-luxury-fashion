import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { Product } from "@/types"

interface FilterParams {
  category?: string
  priceMin?: number
  priceMax?: number
  sizes?: string[]
  fabrics?: string[]
  occasions?: string[]
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export function useProducts(initialFilters: FilterParams = {}) {
  const [products, setProducts] = useState<Product[]>([])
  // Start true so the skeleton shows immediately on first render
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterParams>(initialFilters)
  const [total, setTotal] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchProducts = useCallback(async (currentFilters: FilterParams) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get("/api/products", { params: currentFilters })
      setProducts(res.data.products || [])
      setTotal(res.data.total ?? res.data.pagination?.total ?? 0)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to fetch products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Debounce by 300ms to avoid hammering the API on rapid filter changes
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchProducts(filters)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters, fetchProducts])

  const updateFilters = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return {
    products,
    loading,
    error,
    filters,
    total,
    updateFilters,
    resetFilters,
    refetch: () => fetchProducts(filters),
  }
}

