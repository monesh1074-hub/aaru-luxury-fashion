import { prisma } from "@/lib/prisma"

const DASHBOARD_CACHE_MS = 30_000
let dashboardCache: { data: unknown; expiresAt: number } | null = null

export function getCachedDashboardStats(): unknown | null {
  if (dashboardCache && dashboardCache.expiresAt > Date.now()) {
    return dashboardCache.data
  }
  return null
}

export function setCachedDashboardStats(data: unknown) {
  dashboardCache = { data, expiresAt: Date.now() + DASHBOARD_CACHE_MS }
}

export function clearDashboardStatsCache() {
  dashboardCache = null
}

/** Run queries sequentially on one connection — safe when pool connection_limit=1. */
export async function withDb<T>(fn: (db: typeof prisma) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => fn(tx as typeof prisma))
}
