"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/types"
import { formatPrice, formatDate } from "@/lib/utils"
import { CheckCircle, ShoppingBag } from "lucide-react"

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  const { fetchOrderById } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderById(params.id).then(setOrder).catch(console.error).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center font-body text-text-secondary text-sm">Loading order confirmation...</div>

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <CheckCircle size={56} className="text-gold mx-auto" />
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-dark">Order Confirmed</h1>
          <p className="text-xs text-text-secondary tracking-wider">Thank you for shopping with AARU Luxury.</p>
        </div>
        {order && (
          <div className="bg-white border border-border p-6 text-left space-y-4">
            <div className="flex justify-between text-xs uppercase tracking-wider">
              <span className="text-text-secondary">Order Number</span>
              <span className="font-bold text-dark">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-wider">
              <span className="text-text-secondary">Date</span>
              <span className="font-medium text-dark">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-wider">
              <span className="text-text-secondary">Total Paid</span>
              <span className="font-accent text-gold font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
            <hr className="border-border" />
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/orders" className="flex-1 bg-dark text-background px-6 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gold hover:text-dark transition-all duration-300 text-center">Track Order</Link>
          <Link href="/shop" className="flex-1 border border-dark text-dark px-6 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-dark hover:text-background transition-all duration-300 text-center">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
