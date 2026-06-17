"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/types"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { User, ShoppingBag, Heart, MapPin, LogOut, Truck, PackageCheck, Settings } from "lucide-react"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { logout } = useAuth()
  const { fetchOrderById } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(params.id)
        setOrder(data)
      } catch (err: any) {
        setError(err.message || "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [params.id])

  const navigation = [
    { label: "Overview", href: "/dashboard", icon: User },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, active: true },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const getStepActive = (status: string, current: string) => {
    const sequence = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]
    const statusIndex = sequence.indexOf(status)
    const currentIndex = sequence.indexOf(current)
    return currentIndex <= statusIndex
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Orders", href: "/dashboard/orders" },
            { label: order?.orderNumber || "Details" },
          ]}
        />

        {/* Header */}
        <div className="mb-12 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
              Order Details
            </span>
            <h1 className="font-display text-3xl font-semibold text-dark">
              {order ? order.orderNumber : "Loading Invoice..."}
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-error hover:opacity-80 transition-opacity"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Bar */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-6">
            {navigation.map((nav, idx) => {
              const Icon = nav.icon
              return (
                <Link
                  key={idx}
                  href={nav.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors duration-300 w-full ${
                    nav.active
                      ? "bg-gold/10 text-gold border-l border-gold font-bold"
                      : "text-text-secondary hover:text-dark hover:bg-border/20"
                  }`}
                >
                  <Icon size={14} />
                  <span>{nav.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Details Content (Right) */}
          <div className="lg:col-span-9 space-y-8">
            {loading ? (
              <p className="text-xs uppercase tracking-widest text-text-secondary">
                Loading order details...
              </p>
            ) : error || !order ? (
              <p className="text-sm text-error font-semibold">{error || "Order not found"}</p>
            ) : (
              <>
                {/* 1. Status Progress Timeline */}
                <div className="border border-border p-6 bg-white space-y-6">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark border-b border-border pb-2.5">
                    Delivery Progress
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-semibold uppercase tracking-wider">
                    {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => {
                      const active = getStepActive(order.status, st)
                      return (
                        <div key={st} className="space-y-2 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                              active
                                ? "bg-gold border-gold text-dark font-bold shadow-md"
                                : "border-border text-text-secondary"
                            }`}
                          >
                            {st === "DELIVERED" ? <PackageCheck size={14} /> : <Truck size={14} />}
                          </div>
                          <span className={active ? "text-dark" : "text-text-secondary"}>
                            {st}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Items Purchased */}
                <div className="border border-border p-6 bg-white space-y-4">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark border-b border-border pb-2.5">
                    Items Purchased
                  </h3>
                  <div className="divide-y divide-border/60">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-dark uppercase block">{item.productName}</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5">
                            Qty: {item.quantity} | Unit Price: {formatPrice(item.unitPrice)}
                          </span>
                        </div>
                        <span className="font-accent text-gold font-bold">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Columns: Address & Invoice Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Address */}
                  <div className="border border-border p-6 bg-white space-y-3">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark border-b border-border pb-2.5">
                      Shipping Address
                    </h3>
                    {order.address ? (
                      <div className="text-xs text-text-secondary leading-relaxed">
                        <span className="block font-bold text-dark mb-1">{order.address.fullName}</span>
                        <span>{order.address.addressLine1}</span>
                        {order.address.addressLine2 && <span className="block">{order.address.addressLine2}</span>}
                        <span className="block">
                          {order.address.city}, {order.address.state} - {order.address.pincode}
                        </span>
                        <span className="block mt-1">Phone: {order.address.phone}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-secondary">Address details unavailable</span>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="border border-border p-6 bg-white space-y-4">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark border-b border-border pb-2.5">
                      Payment Summary
                    </h3>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-dark">{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-success">
                          <span>Discount</span>
                          <span>-{formatPrice(order.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Taxes (12% GST)</span>
                        <span className="font-medium text-dark">{formatPrice(order.gstAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium text-dark">
                          {order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}
                        </span>
                      </div>
                      <hr className="border-border/60 my-1" />
                      <div className="flex justify-between text-sm font-semibold uppercase tracking-wider text-dark">
                        <span>Grand Total</span>
                        <span className="font-accent text-gold text-base font-bold">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
