import React from "react"
import { formatPrice } from "@/lib/utils"
import { Landmark, ShoppingBag, Users, Scissors } from "lucide-react"

interface StatsProps {
  stats: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    pendingCustomOrders: number
  }
}

export const DashboardStats: React.FC<StatsProps> = ({ stats }) => {
  const items = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: Landmark,
      color: "text-gold",
    },
    {
      label: "Total Orders",
      value: `${stats.totalOrders} Placed`,
      icon: ShoppingBag,
      color: "text-success",
    },
    {
      label: "Active Customers",
      value: `${stats.totalCustomers} Profiles`,
      icon: Users,
      color: "text-dark",
    },
    {
      label: "Bespoke Inquiries",
      value: `${stats.pendingCustomOrders} Pending`,
      icon: Scissors,
      color: "text-gold",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
      {items.map((item, idx) => {
        const Icon = item.icon
        return (
          <div key={idx} className="border border-border p-6 bg-white flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                {item.label}
              </span>
              <span className="text-xl font-bold font-accent text-dark">{item.value}</span>
            </div>
            <div className={`p-3 bg-border/20 ${item.color}`}>
              <Icon size={20} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
