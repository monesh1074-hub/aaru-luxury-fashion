import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

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
    return { userId: decoded.id }
  } catch (e) {
    console.error('JWT verification failed:', e)
    return null
  }
}

// PUT update address
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Verify address ownership
    const address = await prisma.address.findUnique({
      where: { id: params.id }
    })

    if (!address) {
      return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 })
    }

    if (address.userId !== user.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false }
      })
    }

    const updated = await prisma.address.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PUT address error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE address
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Verify address ownership
    const address = await prisma.address.findUnique({
      where: { id: params.id }
    })

    if (!address) {
      return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 })
    }

    if (address.userId !== user.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    await prisma.address.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })
  } catch (error) {
    console.error('DELETE address error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
