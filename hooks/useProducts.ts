import { useState, useEffect } from "react"
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterParams>(initialFilters)
  const [total, setTotal] = useState(0)

  const fetchProducts = async (currentFilters: FilterParams) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get("/api/products", { params: currentFilters })
      setProducts(res.data.products || [])
      setTotal(res.data.total || 0)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(filters)
  }, [filters])

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
