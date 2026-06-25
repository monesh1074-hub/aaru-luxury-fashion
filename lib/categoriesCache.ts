interface CacheEntry {
  data: unknown
  expiresAt: number
}

let categoriesCache: CacheEntry | null = null
const TTL = 30 * 60 * 1000 // 30 minutes — categories change rarely

export function getCachedCategories(): unknown | null {
  if (categoriesCache && categoriesCache.expiresAt > Date.now()) {
    return categoriesCache.data
  }
  categoriesCache = null
  return null
}

export function setCachedCategories(data: unknown): void {
  categoriesCache = { data, expiresAt: Date.now() + TTL }
}

export function clearCategoriesCache(): void {
  categoriesCache = null
}
