"use client"

import { useEffect } from "react"
import axios from "@/lib/apiClient"
import { writeClientCache, readClientCache, isClientCacheFresh } from "@/lib/clientCache"

const ADMIN_CACHE_TTL = 5 * 60 * 1000

const PREFETCH_ROUTES: Array<{ key: string; url: string; parse: (res: unknown) => unknown }> = [
  {
    key: "admin:dashboard",
    url: "/api/admin/dashboard",
    parse: (res) => res,
  },
  {
    key: "admin:products",
    url: "/api/admin/products?limit=100&view=list",
    parse: (res) => {
      const data = res as { data?: unknown[] }
      return { products: data.data || [] }
    },
  },
  {
    key: "admin:orders",
    url: "/api/admin/orders?limit=50",
    parse: (res) => {
      const data = res as { data?: { orders?: unknown[] } }
      return { orders: data.data?.orders || [] }
    },
  },
  {
    key: "admin:customers",
    url: "/api/admin/customers",
    parse: (res) => {
      const data = res as { customers?: unknown[] }
      return { customers: data.customers || [] }
    },
  },
  {
    key: "admin:custom-orders",
    url: "/api/custom-orders",
    parse: (res) => {
      const data = res as { inquiries?: unknown[] }
      return { inquiries: data.inquiries || [] }
    },
  },
]

async function prefetchAdminRoute(route: (typeof PREFETCH_ROUTES)[number]) {
  if (isClientCacheFresh(route.key) && readClientCache(route.key)) return

  try {
    const res = await axios.get(route.url)
    writeClientCache(route.key, route.parse(res.data), ADMIN_CACHE_TTL)
  } catch {
    // prefetch failures are non-blocking
  }
}

/** Prefetch one route at a time to avoid exhausting the DB connection pool. */
async function prefetchAdminRoutesSequential(routes: typeof PREFETCH_ROUTES) {
  for (const route of routes) {
    await prefetchAdminRoute(route)
  }
}

export function AdminPrefetch() {
  useEffect(() => {
    // Load dashboard first, then warm other admin pages in the background.
    prefetchAdminRoute(PREFETCH_ROUTES[0]).then(() => {
      prefetchAdminRoutesSequential(PREFETCH_ROUTES.slice(1))
    })
  }, [])

  return null
}

export function prefetchAdminPage(key: string) {
  const route = PREFETCH_ROUTES.find((r) => r.key === key)
  if (route) prefetchAdminRoute(route)
}

export { ADMIN_CACHE_TTL }
