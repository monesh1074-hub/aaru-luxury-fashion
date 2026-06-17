import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, hashPassword, comparePassword } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile number').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
})

// GET /api/user/profile — fetch authenticated user's profile
export async function GET() {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT /api/user/profile — update profile or change password
export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { name, email, mobile, currentPassword, newPassword } = parsed.data

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is required to set a new password' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({ where: { id: authUser.id } })
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
      }

      const isValid = await comparePassword(currentPassword, user.passwordHash)
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 400 }
        )
      }
    }

    // Check for duplicate email or mobile (excluding self)
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing && existing.id !== authUser.id) {
        return NextResponse.json(
          { success: false, message: 'This email is already in use by another account' },
          { status: 409 }
        )
      }
    }

    if (mobile) {
      const existing = await prisma.user.findUnique({ where: { mobile } })
      if (existing && existing.id !== authUser.id) {
        return NextResponse.json(
          { success: false, message: 'This mobile number is already in use by another account' },
          { status: 409 }
        )
      }
    }

    // Build update payload
    const updateData: any = {}
    if (name) updateData.name = name.trim()
    if (email) updateData.email = email.toLowerCase().trim()
    if (mobile) updateData.mobile = mobile.trim()
    if (newPassword) updateData.passwordHash = await hashPassword(newPassword)

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        isVerified: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
