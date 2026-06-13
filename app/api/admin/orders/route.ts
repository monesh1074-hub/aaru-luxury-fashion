import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()

    // Check authentication first
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Then check admin role
    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") // PENDING, PROCESSING, COMPLETED, CANCELLED, RETURNED
    const paymentStatus = searchParams.get("paymentStatus") // UNPAID, PAID, FAILED, REFUNDED
    const pageStr = searchParams.get("page") || "1"
    const limitStr = searchParams.get("limit") || "20"

    const page = Math.max(1, parseInt(pageStr))
    const limit = Math.min(100, Math.max(1, parseInt(limitStr)))
    const skip = (page - 1) * limit

    const where: any = {}

    // Only filter by valid status values
    if (status && ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "RETURNED"].includes(status)) {
      where.status = status
    }
    if (paymentStatus && ["UNPAID", "PAID", "FAILED", "REFUNDED"].includes(paymentStatus)) {
      where.paymentStatus = paymentStatus
    }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true
            }
          },
          address: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          payments: true,
          shipments: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    console.error("Admin orders GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
