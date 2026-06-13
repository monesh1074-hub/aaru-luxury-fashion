import { useState } from "react"
import axios from "axios"
import { useCart } from "./useCart"
import { Order } from "@/types"
import { useAuthStore } from "@/store/authStore"

export function useOrders() {
  const { clearCart } = useCart()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const ordersData = Array.isArray(res.data)
        ? res.data
        : (res.data.orders || res.data.data || [])
      setOrders(ordersData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderById = async (id: string): Promise<Order> => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLoading(false)
      return res.data.order || res.data
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.message || "Failed to fetch order details"
      setError(msg)
      throw new Error(msg)
    }
  }

  const createOrder = async (orderData: {
    addressId: string
    items: { productId: string; variantId: string; quantity: number }[]
    couponCode?: string
    notes?: string
    gatewayOrderId: string
    gatewayTransactionId: string
    gatewaySignature: string
    paymentMethod: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      clearCart()
      setLoading(false)
      return res.data.order
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.message || "Failed to create order"
      setError(msg)
      throw new Error(msg)
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
  }
}
