import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { normalizeWishlistItems } from "@/lib/wishlistUtils"

async function loadWishlist(userId: string) {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          variants: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const wishlistItems = await loadWishlist(user.id)

    return NextResponse.json({
      success: true,
      wishlist: normalizeWishlistItems(wishlistItems),
    })
  } catch (error) {
    console.error("Wishlist GET error:", error)
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

    const { productId, action } = await req.json()

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      )
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    const shouldAdd = action === "add" ? true : action === "remove" ? false : !existing

    if (shouldAdd) {
      if (!existing) {
        await prisma.wishlist.create({
          data: {
            userId: user.id,
            productId,
          },
        })
      }
      return NextResponse.json({
        success: true,
        message: "Product added to wishlist",
        wishlisted: true,
      })
    }

    if (existing) {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
      wishlisted: false,
    })
  } catch (error) {
    console.error("Wishlist POST error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
