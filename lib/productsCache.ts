import { buildProductsCacheKey } from "./cacheUtils"

interface CacheEntry {
  data: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const TTL = 5 * 60 * 1000 // 5 minutes server-side cache

export function getCachedProducts(key: string): unknown | null {
  const entry = cache.get(key)
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data
  }
  if (entry) cache.delete(key)
  return null
}

export function getCachedProductsByParams(params: Record<string, unknown>): unknown | null {
  return getCachedProducts(buildProductsCacheKey(params))
}

export function setCachedProducts(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + TTL })
}

export function setCachedProductsByParams(params: Record<string, unknown>, data: unknown): void {
  setCachedProducts(buildProductsCacheKey(params), data)
}

export function clearProductsCache(): void {
  cache.clear()
}
