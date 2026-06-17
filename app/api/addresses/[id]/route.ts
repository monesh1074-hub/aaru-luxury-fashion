import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

// PUT update address
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
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

    if (address.userId !== user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
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
    const user = await getAuthUser()
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

    if (address.userId !== user.id) {
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
