import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            variants: true,
            category: true
          }
        },
        variant: true
      }
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Cart GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { items } = await req.json()

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { message: "Items must be an array" },
        { status: 400 }
      )
    }

    // Sync database cart items using transactional queries
    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: { userId: user.id }
      }),
      prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          userId: user.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        }))
      })
    ])

    return NextResponse.json({
      success: true,
      message: "Cart synced successfully"
    })
  } catch (error) {
    console.error("Cart POST error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
