import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { Product } from "@/types"
import { getClientCachedProducts, setClientCachedProducts } from "@/lib/clientProductsCache"

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

// Serialize arrays so the API receives repeatable query params
function serializeParams(params: FilterParams) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)))
    } else {
      search.append(key, String(value))
    }
  })
  return search.toString()
}

export function useProducts(initialFilters: FilterParams = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterParams>(initialFilters)
  const [total, setTotal] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)

  const fetchProducts = useCallback(async (currentFilters: FilterParams) => {
    const requestId = ++requestIdRef.current

    // Show cached data instantly for faster perceived load
    const cached = getClientCachedProducts(currentFilters as Record<string, unknown>)
    if (cached) {
      setProducts(cached.products as Product[])
      setTotal(cached.total)
      setLoading(false)
    } else {
      setLoading(true)
    }

    setError(null)
    try {
      const query = serializeParams(currentFilters)
      const res = await axios.get(`/api/products?${query}`)
      if (requestId !== requestIdRef.current) return

      const nextProducts = res.data.products || []
      const nextTotal = res.data.total ?? res.data.pagination?.total ?? 0

      setProducts(nextProducts)
      setTotal(nextTotal)
      setClientCachedProducts(currentFilters as Record<string, unknown>, {
        products: nextProducts,
        total: nextTotal,
      })
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return
      console.error(err)
      setError(err.response?.data?.message || "Failed to fetch products")
      if (!cached) setProducts([])
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
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
