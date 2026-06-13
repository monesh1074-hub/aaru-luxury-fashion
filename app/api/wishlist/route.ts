import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            variants: true
          }
        }
      }
    })

    return NextResponse.json(wishlistItems)
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

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if the item is already wishlisted
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    })

    if (existingWishlist) {
      // Toggle off (remove)
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId
          }
        }
      })
      return NextResponse.json({
        success: true,
        message: "Product removed from wishlist",
        wishlisted: false
      })
    } else {
      // Toggle on (add)
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          productId
        }
      })
      return NextResponse.json({
        success: true,
        message: "Product added to wishlist",
        wishlisted: true
      })
    }
  } catch (error) {
    console.error("Wishlist POST error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
