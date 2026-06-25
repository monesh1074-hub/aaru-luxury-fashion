import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import axios from "@/lib/apiClient"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore()
  const clearCart = useCartStore((state) => state.clearCart)
  const syncCart = useCartStore((state) => state.syncWithServer)
  const syncWishlist = useWishlistStore((state) => state.syncWithServer)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("/api/auth/register", data, { withCredentials: true })
      setLoading(false)
      return res.data
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.error || err.response?.data?.message || "Registration failed"
      setError(msg)
      throw new Error(msg)
    }
  }

  const verifyOtp = async (mobile: string, otpCode: string, purpose: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        "/api/auth/verify-otp",
        { mobile, otp: otpCode, purpose },
        { withCredentials: true }
      )
      if (res.data.success && res.data.token && res.data.user) {
        storeLogin(res.data.user, res.data.token)
        if (res.data.cart) syncCart(res.data.cart)
        if (res.data.wishlist) syncWishlist(res.data.wishlist)
      }
      setLoading(false)
      return res.data
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.message || "OTP verification failed"
      setError(msg)
      throw new Error(msg)
    }
  }

  const login = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("/api/auth/login", data, { withCredentials: true })
      if (res.data.success && res.data.token && res.data.user) {
        storeLogin(res.data.user, res.data.token)
        if (res.data.cart) syncCart(res.data.cart)
        if (res.data.wishlist) syncWishlist(res.data.wishlist)
      }
      setLoading(false)
      return res.data
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.message || "Login failed"
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await axios.post("/api/auth/logout", null, { withCredentials: true })
      storeLogout()
      clearCart()
      router.push("/")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async (mobile: string, purpose: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        "/api/auth/send-otp",
        { mobile, purpose },
        { withCredentials: true }
      )
      setLoading(false)
      return res.data
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.message || "Failed to send OTP"
      setError(msg)
      throw new Error(msg)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    verifyOtp,
    login,
    logout,
    sendOtp,
  }
}
