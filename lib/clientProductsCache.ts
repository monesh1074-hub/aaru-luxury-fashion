const STORAGE_PREFIX = "aaru_products_"
const TTL = 5 * 60 * 1000 // 5 minutes client-side cache

interface ClientCacheEntry {
  data: {
    products: unknown[]
    total: number
  }
  expiresAt: number
}

function buildCacheKey(filters: Record<string, unknown>): string {
  const sorted = Object.keys(filters)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      const val = filters[key]
      if (val !== undefined && val !== null && val !== "") {
        acc[key] = val
      }
      return acc
    }, {})
  return STORAGE_PREFIX + JSON.stringify(sorted)
}

export function getClientCachedProducts(
  filters: Record<string, unknown>
): ClientCacheEntry["data"] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(buildCacheKey(filters))
    if (!raw) return null
    const entry: ClientCacheEntry = JSON.parse(raw)
    if (entry.expiresAt > Date.now()) {
      return entry.data
    }
    sessionStorage.removeItem(buildCacheKey(filters))
  } catch {
    // ignore corrupt cache entries
  }
  return null
}

export function setClientCachedProducts(
  filters: Record<string, unknown>,
  data: ClientCacheEntry["data"]
): void {
  if (typeof window === "undefined") return
  try {
    const entry: ClientCacheEntry = {
      data,
      expiresAt: Date.now() + TTL,
    }
    sessionStorage.setItem(buildCacheKey(filters), JSON.stringify(entry))
  } catch {
    // sessionStorage full or unavailable
  }
}

export function clearClientProductsCache(): void {
  if (typeof window === "undefined") return
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(key)
      }
    })
  } catch {
    // ignore
  }
}
