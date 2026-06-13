import React from "react"
import { Order } from "@/types"
import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "../ui/Badge"

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, newStatus: string) => void
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onStatusChange }) => {
  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

  return (
    <div className="overflow-x-auto border border-border bg-white font-body text-text-primary">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-border/20 border-b border-border text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
            <th className="p-4">Order Number</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Date</th>
            <th className="p-4">Total</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Delivery Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs divide-y divide-border/60">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-text-secondary uppercase tracking-widest">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-border/5">
                <td className="p-4 font-bold uppercase tracking-wider">{order.orderNumber}</td>
                <td className="p-4">
                  <span className="block font-semibold">{order.user?.name || "Guest User"}</span>
                  <span className="block text-[10px] text-text-secondary">{order.user?.email}</span>
                </td>
                <td className="p-4 text-text-secondary">{formatDate(order.createdAt)}</td>
                <td className="p-4 font-accent text-gold font-bold">{formatPrice(order.totalAmount)}</td>
                <td className="p-4">
                  <Badge variant={order.paymentStatus === "PAID" ? "success" : "outline"}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "success"
                        : order.status === "CANCELLED"
                        ? "error"
                        : "gold"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className="bg-white border border-border px-2 py-1 focus:outline-none focus:border-gold text-[10px] uppercase font-bold tracking-wider"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
