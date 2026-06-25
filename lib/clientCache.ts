const STORAGE_PREFIX = "aaru_cache_"
const DEFAULT_TTL = 5 * 60 * 1000

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const memory = new Map<string, CacheEntry<unknown>>()

function storageKey(key: string) {
  return STORAGE_PREFIX + key
}

export function readClientCache<T>(key: string): T | null {
  const mem = memory.get(key) as CacheEntry<T> | undefined
  if (mem && mem.expiresAt > Date.now()) {
    return mem.data
  }
  if (mem) memory.delete(key)

  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(storageKey(key))
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (entry.expiresAt > Date.now()) {
      memory.set(key, entry)
      return entry.data
    }
    sessionStorage.removeItem(storageKey(key))
  } catch {
    // ignore corrupt entries
  }
  return null
}

export function isClientCacheFresh(key: string): boolean {
  const mem = memory.get(key)
  if (mem && mem.expiresAt > Date.now()) return true

  if (typeof window === "undefined") return false
  try {
    const raw = sessionStorage.getItem(storageKey(key))
    if (!raw) return false
    const entry = JSON.parse(raw) as CacheEntry<unknown>
    return entry.expiresAt > Date.now()
  } catch {
    return false
  }
}

export function writeClientCache<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttl,
  }
  memory.set(key, entry)

  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(storageKey(key), JSON.stringify(entry))
  } catch {
    // storage full
  }
}

export function clearClientCache(key?: string): void {
  if (key) {
    memory.delete(key)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey(key))
    }
    return
  }

  memory.clear()
  if (typeof window === "undefined") return
  try {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(k)
      }
    })
  } catch {
    // ignore
  }
}

export function clearClientCachePrefix(prefix: string): void {
  memory.forEach((_, key) => {
    if (key.startsWith(prefix)) memory.delete(key)
  })
  if (typeof window === "undefined") return
  try {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith(STORAGE_PREFIX + prefix)) {
        sessionStorage.removeItem(k)
      }
    })
  } catch {
    // ignore
  }
}
