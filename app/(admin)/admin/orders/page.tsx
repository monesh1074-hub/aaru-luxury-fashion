"use client"

import React from "react"
import axios from "@/lib/apiClient"
import { OrderTable } from "@/components/admin/OrderTable"
import { Toast } from "@/components/ui/Toast"
import { useCachedQuery } from "@/hooks/useCachedQuery"
import { clearClientCache } from "@/lib/clientCache"
import { clearDashboardStatsCache } from "@/lib/adminDb"
import { ADMIN_CACHE_TTL } from "@/components/admin/AdminPrefetch"
import { Order } from "@/types"

interface AdminOrdersData {
  orders: Order[]
}

export default function AdminOrdersPage() {
  const { data, loading, refresh } = useCachedQuery<AdminOrdersData>(
    "admin:orders",
    async () => {
      const response = await axios.get("/api/admin/orders?limit=50")
      return { orders: response.data?.data?.orders || [] }
    },
    { ttl: ADMIN_CACHE_TTL }
  )

  const orders = data?.orders || []

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus })
      Toast.success(`Order status updated to ${newStatus}`)
      clearClientCache("admin:dashboard")
      clearDashboardStatsCache()
      refresh()
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data.message
          : "Failed to update order status"
      Toast.error(message)
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-6 animate-pulse font-body">
        <div className="h-8 w-40 bg-border/40" />
        <div className="h-64 bg-border/20" />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-body">
      <div>
        <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block mb-1.5">
          Sales & Fulfillment
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
          Manage Orders
        </h1>
        <div className="w-12 h-0.5 bg-gold mt-3" />
      </div>

      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  )
}
