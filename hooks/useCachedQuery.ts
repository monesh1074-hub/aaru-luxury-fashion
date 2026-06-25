import { useState, useEffect, useCallback, useRef } from "react"
import {
  readClientCache,
  writeClientCache,
  isClientCacheFresh,
  clearClientCache,
} from "@/lib/clientCache"

interface UseCachedQueryOptions {
  ttl?: number
  enabled?: boolean
}

export function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCachedQueryOptions = {}
) {
  const { ttl, enabled = true } = options
  const cachedInitial = enabled ? readClientCache<T>(key) : null

  const [data, setData] = useState<T | null>(cachedInitial)
  const [loading, setLoading] = useState(enabled && !cachedInitial)
  const [error, setError] = useState<string | null>(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const mountedRef = useRef(true)

  const load = useCallback(
    async (silent = false) => {
      if (!enabled) return

      const cached = readClientCache<T>(key)
      if (cached) {
        setData(cached)
        if (!silent) setLoading(false)
      } else if (!silent) {
        setLoading(true)
      }

      setError(null)
      try {
        const result = await fetcherRef.current()
        if (!mountedRef.current) return
        setData(result)
        writeClientCache(key, result, ttl)
      } catch (err: unknown) {
        if (!mountedRef.current) return
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load data"
        setError(message)
        if (!cached && !silent) setData(null)
      } finally {
        if (mountedRef.current && !silent) {
          setLoading(false)
        }
      }
    },
    [key, ttl, enabled]
  )

  useEffect(() => {
    mountedRef.current = true
    if (!enabled) {
      setLoading(false)
      return () => {
        mountedRef.current = false
      }
    }

    if (isClientCacheFresh(key)) {
      const cached = readClientCache<T>(key)
      if (cached) {
        setData(cached)
        setLoading(false)
      }
      load(true)
    } else {
      load(false)
    }

    return () => {
      mountedRef.current = false
    }
  }, [key, enabled, load])

  const refresh = useCallback(() => load(false), [load])

  const invalidate = useCallback(() => {
    clearClientCache(key)
  }, [key])

  return { data, loading, error, refresh, invalidate, setData }
}
