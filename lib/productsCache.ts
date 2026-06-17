interface CacheEntry {
  data: any
  expiresAt: number
}

// In-memory cache for product listings
const cache = new Map<string, CacheEntry>()
const TTL = 30 * 1000 // 30 seconds

export function getCachedProducts(key: string): any | null {
  const entry = cache.get(key)
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data
  }
  if (entry) {
    cache.delete(key) // clean up expired entry
  }
  return null
}

export function setCachedProducts(key: string, data: any): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + TTL,
  })
}

export function clearProductsCache(): void {
  cache.clear()
}
