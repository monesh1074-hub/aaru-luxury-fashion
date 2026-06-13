"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { OrderTable } from "@/components/admin/OrderTable"
import { Toast } from "@/components/ui/Toast"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin/orders")
      setOrders(response.data?.data?.orders || [])
    } catch (err) {
      console.error(err)
      Toast.error("Failed to load customer orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus })
      Toast.success(`Order status updated to ${newStatus}`)
      fetchOrders() // Refresh order data
    } catch (err: any) {
      Toast.error(err.response?.data?.message || "Failed to update order status")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-body">
        <div className="h-8 w-40 bg-border/40" />
        <div className="h-64 bg-border/20" />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div>
        <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block mb-1.5">
          Sales & Fulfillment
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
          Manage Orders
        </h1>
        <div className="w-12 h-0.5 bg-gold mt-3" />
      </div>

      {/* Orders List Table Component */}
      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  )
}
