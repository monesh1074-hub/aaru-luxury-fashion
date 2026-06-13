import React from "react"
import { Order } from "@/types"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "../ui/Badge"
import Link from "next/link"

interface OrderCardProps {
  order: Order
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success"
      case "CANCELLED":
        return "error"
      case "PENDING":
        return "gold"
      default:
        return "outline"
    }
  }

  return (
    <div className="border border-border p-6 bg-white space-y-4 font-body text-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] text-text-secondary uppercase tracking-wider block">
            Order Number
          </span>
          <span className="font-bold text-xs uppercase tracking-widest">{order.orderNumber}</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
          <Badge variant={order.paymentStatus === "PAID" ? "success" : "outline"}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-border/60 text-xs">
        <div>
          <span className="text-text-secondary block mb-0.5">Placed on</span>
          <span className="font-medium text-dark">{formatDate(order.createdAt)}</span>
        </div>
        <div>
          <span className="text-text-secondary block mb-0.5">Total Amount</span>
          <span className="font-accent text-gold font-bold">{formatPrice(order.totalAmount)}</span>
        </div>
        <div>
          <span className="text-text-secondary block mb-0.5">Items</span>
          <span className="font-medium text-dark">
            {order.items.reduce((acc, it) => acc + it.quantity, 0)} Pcs
          </span>
        </div>
        <div className="flex justify-end items-center">
          <Link
            href={`/dashboard/orders/${order.id}`}
            className="text-[10px] uppercase tracking-widest font-semibold border-b border-dark pb-0.5 hover:border-gold hover:text-gold transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
