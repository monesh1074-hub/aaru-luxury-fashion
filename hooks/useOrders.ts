import { useState, useCallback, useEffect, useRef } from "react"
import axios from "@/lib/apiClient"
import { useCart } from "./useCart"
import { Order } from "@/types"
import { useAuthStore } from "@/store/authStore"
import {
  readClientCache,
  writeClientCache,
  isClientCacheFresh,
  clearClientCache,
} from "@/lib/clientCache"

const ORDERS_CACHE_KEY = "user:orders"
const ORDERS_CACHE_TTL = 5 * 60 * 1000

export function useOrders() {
  const { clearCart } = useCart()
  const { token } = useAuthStore()
  const cachedInitial = readClientCache<Order[]>(ORDERS_CACHE_KEY)
  const [loading, setLoading] = useState(!cachedInitial)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>(cachedInitial || [])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchOrders = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false
    const cached = readClientCache<Order[]>(ORDERS_CACHE_KEY)

    if (cached) {
      setOrders(cached)
      if (!silent) setLoading(false)
    } else if (!silent) {
      setLoading(true)
    }

    setError(null)
    try {
      const res = await axios.get("/api/orders", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data.orders || res.data.data || []

      if (!mountedRef.current) return ordersData
      setOrders(ordersData)
      writeClientCache(ORDERS_CACHE_KEY, ordersData, ORDERS_CACHE_TTL)
      return ordersData
    } catch (err: unknown) {
      if (!mountedRef.current) return cached || []
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch orders"
      setError(message)
      return cached || []
    } finally {
      if (mountedRef.current && !silent) {
        setLoading(false)
      }
    }
  }, [token])

  useEffect(() => {
    if (isClientCacheFresh(ORDERS_CACHE_KEY)) {
      fetchOrders({ silent: true })
    } else {
      fetchOrders()
    }
  }, [fetchOrders])

  const fetchOrderById = useCallback(async (id: string): Promise<Order> => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`/api/orders/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setLoading(false)
      return res.data.order || res.data
    } catch (err: unknown) {
      setLoading(false)
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch order details"
      setError(message)
      throw new Error(message)
    }
  }, [token])

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
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      clearCart()
      clearClientCache(ORDERS_CACHE_KEY)
      setLoading(false)
      return res.data.order
    } catch (err: unknown) {
      setLoading(false)
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to create order"
      setError(message)
      throw new Error(message)
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
