import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import axios from "axios"
import { Product } from "@/types"
import {
  getClientCachedProducts,
  setClientCachedProducts,
  isClientCacheFresh,
} from "@/lib/clientProductsCache"
import { resolveCategorySlug } from "@/lib/categorySlugs"

export interface FilterParams {
  category?: string
  priceMin?: number
  priceMax?: number
  sizes?: string[]
  fabrics?: string[]
  occasions?: string[]
  colors?: string[]
  readyToShip?: boolean
  sale?: boolean
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export interface ProductsInitialData {
  products: Product[]
  total: number
}

function mergeFilters(prev: FilterParams, patch: Partial<FilterParams>): FilterParams {
  const next: FilterParams = { ...prev, ...patch, page: 1 }
  ;(["search", "category", "sort"] as const).forEach((key) => {
    if (key in patch && (patch[key] === "" || patch[key] === undefined || patch[key] === null)) {
      delete next[key]
    }
  })
  return next
}

function serializeParams(params: FilterParams) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    if (typeof value === "boolean") {
      search.append(key, String(value))
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)))
    } else {
      search.append(key, String(value))
    }
  })
  return search.toString()
}

function normalizeFilters(filters: FilterParams): FilterParams {
  if (!filters.category) return filters
  return { ...filters, category: resolveCategorySlug(filters.category) }
}

function seedClientCache(filters: FilterParams, data: ProductsInitialData) {
  setClientCachedProducts(normalizeFilters(filters) as Record<string, unknown>, data)
}

function readInitialCache(filters: FilterParams, initialData?: ProductsInitialData) {
  const normalized = normalizeFilters(filters)

  if (initialData?.products.length) {
    seedClientCache(normalized, initialData)
    return {
      products: initialData.products,
      total: initialData.total,
      loading: false,
    }
  }

  const cached = getClientCachedProducts(normalized as Record<string, unknown>)
  if (cached) {
    return {
      products: cached.products as Product[],
      total: cached.total,
      loading: false,
    }
  }

  return { products: [] as Product[], total: 0, loading: true }
}

interface UseProductsOptions {
  initialData?: ProductsInitialData
}

export function useProducts(initialFilters: FilterParams = {}, options?: UseProductsOptions) {
  const normalizedInitial = useMemo(() => normalizeFilters(initialFilters), [initialFilters])
  const initial = readInitialCache(normalizedInitial, options?.initialData)
  const hasServerData = Boolean(options?.initialData?.products.length)

  const [products, setProducts] = useState<Product[]>(initial.products)
  const [loading, setLoading] = useState(initial.loading)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterParams>(normalizedInitial)
  const [total, setTotal] = useState(initial.total)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)
  const isInitialMount = useRef(true)
  const initialFiltersKey = useRef(JSON.stringify(normalizedInitial))
  const normalizedInitialRef = useRef(normalizedInitial)
  const productsCountRef = useRef(initial.products.length)
  normalizedInitialRef.current = normalizedInitial
  productsCountRef.current = products.length

  const fetchProducts = useCallback(
    async (currentFilters: FilterParams, fetchOptions?: { silent?: boolean }) => {
      const normalized = normalizeFilters(currentFilters)
      const requestId = ++requestIdRef.current
      const cached = getClientCachedProducts(normalized as Record<string, unknown>)
      const silent = fetchOptions?.silent ?? false
      const hasDisplayedProducts = productsCountRef.current > 0

      if (!silent) {
        if (cached) {
          setProducts(cached.products as Product[])
          setTotal(cached.total)
          setLoading(false)
          setRefreshing(true)
        } else if (hasDisplayedProducts) {
          setRefreshing(true)
          setLoading(false)
        } else {
          setLoading(true)
          setRefreshing(false)
        }
      }

      setError(null)
      try {
        const query = serializeParams(normalized)
        const res = await axios.get(`/api/products?${query}`)
        if (requestId !== requestIdRef.current) return

        const nextProducts = res.data.products || []
        const nextTotal = res.data.total ?? res.data.pagination?.total ?? 0

        setProducts(nextProducts)
        setTotal(nextTotal)
        setClientCachedProducts(normalized as Record<string, unknown>, {
          products: nextProducts,
          total: nextTotal,
        })
      } catch (err: unknown) {
        if (requestId !== requestIdRef.current) return
        console.error(err)
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to fetch products"
        setError(message)
        if (!cached && !silent && !hasDisplayedProducts) setProducts([])
      } finally {
        if (requestId === requestIdRef.current && !silent) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    },
    []
  )

  useEffect(() => {
    const normalized = normalizeFilters(initialFilters)
    const nextKey = JSON.stringify(normalized)
    if (nextKey === initialFiltersKey.current) return
    initialFiltersKey.current = nextKey
    isInitialMount.current = true

    const cached = readInitialCache(normalized, options?.initialData)
    setFilters(normalized)
    setProducts(cached.products)
    setTotal(cached.total)
    setLoading(cached.loading)
    setRefreshing(false)
    setError(null)
  }, [initialFilters, options?.initialData])

  useEffect(() => {
    const filterKey = normalizeFilters(filters) as Record<string, unknown>
    const cached = getClientCachedProducts(filterKey)

    if (cached) {
      setProducts(cached.products as Product[])
      setTotal(cached.total)
      setLoading(false)
    }

    if (isInitialMount.current) {
      isInitialMount.current = false
      if (hasServerData) {
        return
      }
      if (isClientCacheFresh(filterKey)) {
        fetchProducts(filters, { silent: true })
      } else {
        fetchProducts(filters)
      }
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchProducts(filters), 120)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters, fetchProducts, hasServerData])

  const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters((prev) => normalizeFilters(mergeFilters(prev, newFilters)))
  }, [])

  const setFiltersDirect = useCallback((nextFilters: FilterParams) => {
    setFilters(normalizeFilters(nextFilters))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(normalizedInitialRef.current)
  }, [])

  return {
    products,
    loading,
    refreshing,
    error,
    filters,
    total,
    updateFilters,
    setFilters: setFiltersDirect,
    resetFilters,
    refetch: () => fetchProducts(filters),
  }
}
