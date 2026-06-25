import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import {
  withDb,
  getCachedDashboardStats,
  setCachedDashboardStats,
} from "@/lib/adminDb"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const cached = getCachedDashboardStats()
    if (cached) {
      return NextResponse.json(cached)
    }

    const payload = await withDb(async (db) => {
      const paidOrdersRevenue = await db.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalAmount: true },
      })

      const totalOrdersCount = await db.order.count()

      const totalCustomersCount = await db.user.count({ where: { role: "USER" } })

      const customInquiriesCount = await db.customOrder.count({
        where: { status: "PENDING" },
      })

      const lowStockAlerts = await db.productVariant.findMany({
        where: { stockQty: { lt: 5 } },
        select: {
          id: true,
          sku: true,
          size: true,
          color: true,
          stockQty: true,
          product: { select: { name: true } },
        },
        orderBy: { stockQty: "asc" },
        take: 10,
      })

      const recentOrders = await db.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      })

      return {
        metrics: {
          totalRevenue: paidOrdersRevenue._sum.totalAmount ?? 0,
          ordersCount: totalOrdersCount,
          customersCount: totalCustomersCount,
          customInquiriesCount,
        },
        lowStockAlerts: lowStockAlerts.map((v) => ({
          variantId: v.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          stockQty: v.stockQty,
          productName: v.product.name,
        })),
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.user.name,
          totalAmount: o.totalAmount,
          status: o.status,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
        })),
      }
    })

    setCachedDashboardStats(payload)
    return NextResponse.json(payload)
  } catch (error) {
    console.error("Dashboard Stats GET error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
