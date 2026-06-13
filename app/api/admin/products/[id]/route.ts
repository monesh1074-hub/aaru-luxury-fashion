import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFromCloudinary } from '@/lib/cloudinary'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

import { getAuthUser } from '@/lib/auth'

// GET single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ success: false }, { status: 403 })

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('GET product error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ success: false }, { status: 403 })

    const body = await req.json()

    const product = await prisma.$transaction(async (tx) => {
      // Update main product
      const updated = await tx.product.update({
        where: { id: params.id },
        data: {
          name: body.name,
          description: body.description,
          categoryId: body.categoryId,
          basePrice: Number(body.basePrice),
          salePrice: body.salePrice ? Number(body.salePrice) : null,
          fabric: body.fabric || '',
          occasion: body.occasion || '',
          isCustomizable: body.isCustomizable ?? false,
          isFeatured: body.isFeatured ?? false,
          isNewArrival: body.isNewArrival ?? false,
          isActive: body.isActive ?? true,
          metaTitle: body.metaTitle || body.name,
          metaDescription: body.metaDescription || body.description,
          updatedAt: new Date()
        }
      })

      // Update images if provided
      if (body.images && Array.isArray(body.images)) {
        await tx.productImage.deleteMany({ where: { productId: params.id } })
        await tx.productImage.createMany({
          data: body.images.map((img: any, index: number) => ({
            productId: params.id,
            imageUrl: img.url,
            altText: img.altText || body.name,
            isPrimary: index === 0,
            sortOrder: index
          }))
        })
      }

      // Update variants if provided
      if (body.variants && Array.isArray(body.variants)) {
        await tx.productVariant.deleteMany({ where: { productId: params.id } })
        if (body.variants.length > 0) {
          await tx.productVariant.createMany({
            data: body.variants.map((v: any) => ({
              productId: params.id,
              size: v.size,
              color: v.color || '',
              stockQty: Number(v.stockQty) || 0,
              sku: v.sku || `AARU-${params.id.slice(-6).toUpperCase()}-${v.size}`,
              additionalPrice: Number(v.additionalPrice) || 0
            }))
          })
        }
      }

      return updated
    })

    const complete = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true, images: true, variants: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: complete
    })

  } catch (error) {
    console.error('PUT product error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ success: false }, { status: 403 })

    // Get images to delete from Cloudinary
    const images = await prisma.productImage.findMany({
      where: { productId: params.id }
    })

    // Delete from DB (cascade deletes images and variants)
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: params.id } }),
      prisma.productVariant.deleteMany({ where: { productId: params.id } }),
      prisma.wishlist.deleteMany({ where: { productId: params.id } }),
      prisma.product.delete({ where: { id: params.id } })
    ])

    // Delete images from Cloudinary
    for (const image of images) {
      if (image.imageUrl) {
        const urlParts = image.imageUrl.split('/upload/')
        if (urlParts.length === 2) {
          const pathParts = urlParts[1].split('/')
          pathParts.shift() // remove version
          const publicId = pathParts.join('/').split('.')[0]
          if (publicId) {
            await deleteFromCloudinary(publicId)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('DELETE product error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 })
  }
}
