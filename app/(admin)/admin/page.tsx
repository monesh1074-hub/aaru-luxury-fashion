"use client"

import React from "react"
import axios from "@/lib/apiClient"
import { DashboardStats } from "@/components/admin/DashboardStats"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, AlertTriangle } from "lucide-react"
import { useCachedQuery } from "@/hooks/useCachedQuery"
import { ADMIN_CACHE_TTL } from "@/components/admin/AdminPrefetch"

interface DashboardData {
  metrics: {
    totalRevenue: number
    ordersCount: number
    customersCount: number
    customInquiriesCount: number
  }
  lowStockAlerts: Array<{
    variantId: string
    sku: string
    size: string
    color: string
    stockQty: number
    productName: string
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string
    totalAmount: number
    status: string
    paymentStatus: string
    createdAt: string
  }>
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useCachedQuery<DashboardData>(
    "admin:dashboard",
    async () => {
      const response = await axios.get("/api/admin/dashboard")
      return response.data
    },
    { ttl: ADMIN_CACHE_TTL }
  )

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-border/40" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 h-28 bg-border/20" />
        <div className="h-96 bg-border/10" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="border border-error bg-error/5 text-error p-6 uppercase tracking-wider text-xs font-semibold">
        {error}
      </div>
    )
  }

  const stats = {
    totalRevenue: data?.metrics.totalRevenue || 0,
    totalOrders: data?.metrics.ordersCount || 0,
    totalCustomers: data?.metrics.customersCount || 0,
    pendingCustomOrders: data?.metrics.customInquiriesCount || 0,
  }

  return (
    <div className="space-y-10 font-body">
      <div>
        <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block mb-1.5">
          Overview
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
          Dashboard Summary
        </h1>
        <div className="w-12 h-0.5 bg-gold mt-3" />
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              prefetch
              className="text-[10px] uppercase tracking-wider font-bold text-gold hover:text-dark flex items-center gap-1.5 transition-colors"
            >
              <span>Manage Orders</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <div className="border border-border bg-white divide-y divide-border">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-border/5 transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-dark block">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                      {order.customerName} &bull; {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-dark">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold ${
                      order.status === "DELIVERED"
                        ? "bg-success/15 text-success"
                        : order.status === "PENDING"
                        ? "bg-gold/15 text-gold"
                        : "bg-dark/15 text-dark"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border bg-white">
              <span className="text-xs text-text-secondary uppercase tracking-widest">
                No orders placed yet
              </span>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark flex items-center gap-2">
              <AlertTriangle size={14} className="text-gold" />
              <span>Inventory Warnings</span>
            </h3>
          </div>

          {data?.lowStockAlerts && data.lowStockAlerts.length > 0 ? (
            <div className="border border-border bg-white divide-y divide-border text-xs">
              {data.lowStockAlerts.map((alert) => (
                <div key={alert.variantId} className="p-4 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-dark truncate max-w-[180px]">
                      {alert.productName}
                    </span>
                    <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5">
                      {alert.stockQty} left
                    </span>
                  </div>
                  <div className="text-[9px] text-text-secondary uppercase tracking-wider flex items-center justify-between">
                    <span>SKU: {alert.sku}</span>
                    <span>Size: {alert.size} &bull; Color: {alert.color}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border bg-white">
              <span className="text-xs text-text-secondary uppercase tracking-widest">
                All items in stock
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
