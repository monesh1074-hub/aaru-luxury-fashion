import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().length(10, 'Enter valid 10-digit phone'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().length(6, 'Enter valid 6-digit pincode'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false)
})

function getUserFromRequest(req: NextRequest) {
  try {
    const token = req.cookies.get('aaru_auth_token')?.value
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-for-jwt") as {
      id: string
      email: string
      role: string
    }
    if (!decoded.id) return null
    return {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role
    }
  } catch (e) {
    console.error('JWT verification failed:', e)
    return null
  }
}

// GET all addresses for logged in user
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Please login to continue' },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ success: true, data: addresses })

  } catch (error) {
    console.error('GET addresses error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST create new address
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Please login to continue' },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('Address body received:', body)

    const validated = addressSchema.parse(body)

    // If this is set as default, unset all other defaults first
    if (validated.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false }
      })
    }

    // If this is the first address, make it default automatically
    const existingCount = await prisma.address.count({
      where: { userId: user.userId }
    })

    const address = await prisma.address.create({
      data: {
        ...validated,
        userId: user.userId,
        isDefault: existingCount === 0 ? true : validated.isDefault,
        country: validated.country || 'India'
      }
    })

    console.log('Address created:', address)

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully',
      data: address
    })

  } catch (error) {
    console.error('POST address error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to save address' },
      { status: 500 }
    )
  }
}
