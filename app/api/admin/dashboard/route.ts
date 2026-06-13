import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    // ─── Run ALL queries in PARALLEL (was sequential — 6 round trips → now 1) ───
    const [
      paidOrdersRevenue,
      totalOrdersCount,
      totalCustomersCount,
      customInquiriesCount,
      lowStockAlerts,
      recentOrders,
    ] = await Promise.all([
      // 1. Revenue: aggregate instead of fetching every row
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalAmount: true },
      }),

      // 2. Total orders count
      prisma.order.count(),

      // 3. Customers count
      prisma.user.count({ where: { role: "USER" } }),

      // 4. Pending custom inquiries
      prisma.customOrder.count({ where: { status: "PENDING" } }),

      // 5. Low-stock variants (only fields we need — no include product)
      prisma.productVariant.findMany({
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
      }),

      // 6. Recent 5 orders — only select fields we render
      prisma.order.findMany({
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
      }),
    ])

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Dashboard Stats GET error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
