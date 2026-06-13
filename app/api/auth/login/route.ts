import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, signToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { emailOrMobile, password } = await req.json()

    if (!emailOrMobile || !password) {
      return NextResponse.json(
        { message: "Email/Mobile and password are required" },
        { status: 400 }
      )
    }

    const trimmedIdentifier = emailOrMobile.trim()

    // Find user by email or mobile
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedIdentifier.toLowerCase() },
          { mobile: trimmedIdentifier }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Account is deactivated. Please contact support." },
        { status: 403 }
      )
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Sign JWT Token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    // Fetch user's cart and wishlist to return for state hydration
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: true,
            variants: true
          }
        },
        variant: true
      }
    })

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: true,
            variants: true
          }
        }
      }
    })

    // Map cart and wishlist data
    const formattedCart = cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: item.product,
      variant: item.variant
    }))

    const formattedWishlist = wishlistItems.map(item => ({
      id: item.id,
      productId: item.productId,
      product: item.product
    }))

    // Construct response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified
      },
      cart: formattedCart,
      wishlist: formattedWishlist
    })

    // Set HTTP-only Cookie for Route Guard Middleware authentication
    response.cookies.set({
      name: "aaru_auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error: any) {
    console.error("Login route error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
