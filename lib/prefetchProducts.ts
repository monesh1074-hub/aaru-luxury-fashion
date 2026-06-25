import axios from "axios"
import { getClientCachedProducts, setClientCachedProducts } from "./clientProductsCache"
import { resolveCategorySlug } from "./categorySlugs"
import { buildProductsCacheKey } from "./cacheUtils"

interface PrefetchFilters {
  category?: string
  readyToShip?: boolean
  sale?: boolean
  sort?: string
}

function serializeParams(params: PrefetchFilters) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    if (typeof value === "boolean") {
      search.append(key, String(value))
      return
    }
    search.append(key, String(value))
  })
  return search.toString()
}

const inflight = new Set<string>()

/** Warm client + server cache when user hovers nav links. */
export function prefetchProducts(filters: PrefetchFilters): void {
  if (typeof window === "undefined") return

  const normalized: PrefetchFilters = {
    ...filters,
    category: filters.category ? resolveCategorySlug(filters.category) : undefined,
  }
  const cacheRecord = normalized as Record<string, unknown>
  const key = buildProductsCacheKey(cacheRecord)
  if (getClientCachedProducts(cacheRecord)) return
  if (inflight.has(key)) return

  inflight.add(key)
  const query = serializeParams(normalized)
  axios
    .get(`/api/products?${query}`)
    .then((res) => {
      setClientCachedProducts(cacheRecord, {
        products: res.data.products || [],
        total: res.data.total ?? 0,
      })
    })
    .catch(() => {})
    .finally(() => inflight.delete(key))
}
