import { buildProductsCacheKey } from "./cacheUtils"

const STORAGE_PREFIX = "aaru_products_"
const TTL = 15 * 60 * 1000 // 15 minutes client-side cache

interface ClientCacheEntry {
  data: {
    products: unknown[]
    total: number
  }
  expiresAt: number
}

// In-memory layer — instant reads within the same tab session (no JSON parse)
const memoryCache = new Map<string, ClientCacheEntry>()

function storageKey(filters: Record<string, unknown>): string {
  return STORAGE_PREFIX + buildProductsCacheKey(filters)
}

export function isClientCacheFresh(filters: Record<string, unknown>): boolean {
  const key = buildProductsCacheKey(filters)
  const mem = memoryCache.get(key)
  if (mem && mem.expiresAt > Date.now()) return true

  if (typeof window === "undefined") return false
  try {
    const raw = sessionStorage.getItem(storageKey(filters))
    if (!raw) return false
    const entry: ClientCacheEntry = JSON.parse(raw)
    return entry.expiresAt > Date.now()
  } catch {
    return false
  }
}

export function getClientCachedProducts(
  filters: Record<string, unknown>
): ClientCacheEntry["data"] | null {
  const key = buildProductsCacheKey(filters)

  const mem = memoryCache.get(key)
  if (mem && mem.expiresAt > Date.now()) {
    return mem.data
  }
  if (mem) memoryCache.delete(key)

  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(storageKey(filters))
    if (!raw) return null
    const entry: ClientCacheEntry = JSON.parse(raw)
    if (entry.expiresAt > Date.now()) {
      memoryCache.set(key, entry)
      return entry.data
    }
    sessionStorage.removeItem(storageKey(filters))
  } catch {
    // ignore corrupt cache entries
  }
  return null
}

export function setClientCachedProducts(
  filters: Record<string, unknown>,
  data: ClientCacheEntry["data"]
): void {
  const key = buildProductsCacheKey(filters)
  const entry: ClientCacheEntry = {
    data,
    expiresAt: Date.now() + TTL,
  }

  memoryCache.set(key, entry)

  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(storageKey(filters), JSON.stringify(entry))
  } catch {
    // sessionStorage full or unavailable
  }
}

export function clearClientProductsCache(): void {
  memoryCache.clear()
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
