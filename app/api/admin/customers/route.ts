import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { withDb } from '@/lib/adminDb'

// GET /api/admin/customers
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
      ]
    }

    const { customers, total } = await withDb(async (db) => {
      const rows = await db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      const count = await db.user.count({ where })
      return { customers: rows, total: count }
    })

    const formattedCustomers = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      mobile: c.mobile,
      role: c.role,
      isVerified: c.isVerified,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
      ordersCount: c._count.orders,
    }))

    return NextResponse.json({
      success: true,
      customers: formattedCustomers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Admin customers GET error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
