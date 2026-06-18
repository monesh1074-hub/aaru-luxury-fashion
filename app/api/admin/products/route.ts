import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { clearProductsCache } from '@/lib/productsCache'

function revalidateProductPages() {
  clearProductsCache()
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/search')
}

export const dynamic = 'force-dynamic'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + '-' + Date.now()
}

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional().default(''),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.number().positive('Price must be greater than 0'),
  salePrice: z.number().positive().optional().nullable(),
  fabric: z.string().optional().default(''),
  occasion: z.string().optional().default(''),
  isCustomizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    publicId: z.string(),
    isPrimary: z.boolean().default(false),
    altText: z.string().optional().default('')
  })).min(1, 'At least one product image is required'),
  variants: z.array(z.object({
    size: z.string().min(1, 'Size is required'),
    color: z.string().optional().default(''),
    stockQty: z.number().int().min(0).default(0),
    sku: z.string().optional().default(''),
    additionalPrice: z.number().default(0)
  })).optional().default([])
})

// GET all products (admin sees all including inactive)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }
    if (categoryId) {
      where.categoryId = categoryId
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          _count: { select: { orderItems: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    })

  } catch (error) {
    console.error('GET admin products error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    console.log('Creating product with body:', JSON.stringify(body, null, 2))

    // Parse and validate
    const parsed = productSchema.parse({
      ...body,
      basePrice: Number(body.basePrice),
      salePrice: body.salePrice ? Number(body.salePrice) : null,
    })

    // Generate unique slug
    let slug = generateSlug(parsed.name)
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) slug = slug + '-' + Math.random().toString(36).slice(2, 6)

    // Create product with images and variants in one transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          name: parsed.name,
          slug,
          description: parsed.description,
          categoryId: parsed.categoryId,
          basePrice: parsed.basePrice,
          salePrice: parsed.salePrice,
          fabric: parsed.fabric,
          occasion: parsed.occasion,
          isCustomizable: parsed.isCustomizable,
          isFeatured: parsed.isFeatured,
          isNewArrival: parsed.isNewArrival,
          isActive: parsed.isActive,
          metaTitle: parsed.metaTitle || parsed.name,
          metaDescription: parsed.metaDescription || parsed.description
        }
      })

      console.log('Product created with ID:', newProduct.id)

      // Create product images
      if (parsed.images.length > 0) {
        await tx.productImage.createMany({
          data: parsed.images.map((img, index) => ({
            productId: newProduct.id,
            imageUrl: img.url,
            altText: img.altText || parsed.name,
            isPrimary: index === 0,
            sortOrder: index
          }))
        })
        console.log(`Created ${parsed.images.length} product images`)
      }

      // Create product variants
      if (parsed.variants && parsed.variants.length > 0) {
        await tx.productVariant.createMany({
          data: parsed.variants.map((variant) => ({
            productId: newProduct.id,
            size: variant.size,
            color: variant.color || '',
            stockQty: variant.stockQty,
            sku: variant.sku || `AARU-${newProduct.id.slice(-6).toUpperCase()}-${variant.size}`,
            additionalPrice: variant.additionalPrice
          }))
        })
        console.log(`Created ${parsed.variants.length} variants`)
      }

      return newProduct
    })

    // Fetch complete product to return
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true
      }
    })

    console.log('Product creation complete:', completeProduct?.id)

    revalidateProductPages()

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: completeProduct
    })

  } catch (error) {
    console.error('POST product error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
          errors: error.errors
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    )
  }
}
