import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: "asc" } }
              }
            },
            variant: true
          }
        },
        address: true,
        payments: true,
        shipments: true
      }
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Role Guard: Users can only retrieve their own orders
    if (user.role !== "ADMIN" && order.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden access" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error("Order details GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { status, notes } = await req.json()

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check permissions
    const isAdmin = user.role === "ADMIN"
    const isOwner = order.userId === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden access" }, { status: 403 })
    }

    // Users can only cancel pending orders; Admins can set any state
    if (!isAdmin && status && status !== "CANCELLED") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    if (!isAdmin && status === "CANCELLED" && order.status !== "PENDING") {
      return NextResponse.json({ message: "Only pending orders can be cancelled" }, { status: 400 })
    }

    const previousStatus = order.status

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: status || undefined,
          notes: notes || undefined
        }
      })

      // If status changed to CANCELLED, restore variant inventory stock
      if (status === "CANCELLED" && previousStatus !== "CANCELLED") {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQty: {
                increment: item.quantity
              }
            }
          })
        }

        // Notification of cancel
        await tx.notification.create({
          data: {
            userId: order.userId,
            type: "ORDER_STATUS",
            title: "Order Cancelled",
            message: `Your order ${order.orderNumber} has been successfully cancelled.`
          }
        })
      }

      return updated
    })

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder
    })

  } catch (error) {
    console.error("Order PUT update error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
