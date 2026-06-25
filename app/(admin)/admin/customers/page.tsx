"use client"

import React from "react"
import axios from "@/lib/apiClient"
import { Badge } from "@/components/ui/Badge"
import { useCachedQuery } from "@/hooks/useCachedQuery"
import { ADMIN_CACHE_TTL } from "@/components/admin/AdminPrefetch"

interface CustomerRow {
  id: string
  name: string
  email: string
  mobile: string
  role: string
  isActive: boolean
  createdAt: string
  ordersCount: number
}

interface AdminCustomersData {
  customers: CustomerRow[]
}

export default function AdminCustomersPage() {
  const { data, loading } = useCachedQuery<AdminCustomersData>(
    "admin:customers",
    async () => {
      const response = await axios.get("/api/admin/customers")
      return { customers: response.data?.customers || [] }
    },
    { ttl: ADMIN_CACHE_TTL }
  )

  const customers = data?.customers || []

  if (loading && customers.length === 0) {
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
          Directory
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
          Customer Profiles
        </h1>
        <div className="w-12 h-0.5 bg-gold mt-3" />
      </div>

      <div className="bg-white border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs uppercase tracking-wider border-collapse">
          <thead>
            <tr className="bg-border/10 text-dark border-b border-border font-bold text-[10px]">
              <th className="p-4">Customer Details</th>
              <th className="p-4">Mobile Number</th>
              <th className="p-4">Access Role</th>
              <th className="p-4 text-center">Orders Placed</th>
              <th className="p-4">Account Status</th>
              <th className="p-4">Registered On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-primary">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary uppercase tracking-widest">
                  No customers registered yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-border/5 transition-colors">
                  <td className="p-4 font-semibold text-dark normal-case">
                    <span className="block font-medium font-body text-dark">{customer.name}</span>
                    <span className="text-[10px] text-text-secondary lowercase block font-mono">
                      {customer.email}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary tracking-widest">{customer.mobile}</td>
                  <td className="p-4">
                    <Badge variant={customer.role === "ADMIN" ? "gold" : "outline"}>
                      {customer.role}
                    </Badge>
                  </td>
                  <td className="p-4 font-bold text-center text-dark font-accent">
                    {customer.ordersCount}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold ${
                      customer.isActive ? "text-success" : "text-error"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        customer.isActive ? "bg-success" : "bg-error"
                      }`} />
                      <span>{customer.isActive ? "ACTIVE" : "INACTIVE"}</span>
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
