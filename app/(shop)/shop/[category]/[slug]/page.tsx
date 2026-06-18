import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductDetails } from '@/components/product/ProductDetails'
import { ProductImages } from '@/components/product/ProductImages'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: { category: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { name: true, metaTitle: true, metaDescription: true, description: true },
    })
    if (!product) return { title: 'Product Not Found | AARU' }
    return {
      title: `${product.metaTitle || product.name} | AARU`,
      description: product.metaDescription || product.description.substring(0, 160),
    }
  } catch {
    return { title: 'AARU Luxury Fashion' }
  }
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
  } catch {
    return null
  }
}

async function getRelated(categoryId: string, excludeId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId, isActive: true, id: { not: excludeId } },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: true,
        category: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
    return products.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
  } catch {
    return []
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const raw = await getProduct(params.slug)

  if (!raw) {
    notFound()
  }

  // Serialize dates for client components
  const product = {
    ...raw,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    category: raw.category
      ? { ...raw.category, createdAt: raw.category.createdAt.toISOString() }
      : undefined,
    reviews: raw.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }

  const [related] = await Promise.all([
    getRelated(raw.categoryId, raw.id),
  ])

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        {/* ── Two-column layout: Images LEFT  |  Details RIGHT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {/* LEFT — Product photo gallery */}
          <ProductImages images={product.images as { id: string; imageUrl: string; altText?: string | null }[]} />

          {/* RIGHT — Product info, variants, cart */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductDetails product={product as Parameters<typeof ProductDetails>[0]['product']} />
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <div className="mb-8">
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
                You May Also Love
              </span>
              <h2 className="font-display text-2xl font-semibold text-dark">Related Pieces</h2>
            </div>
            <RelatedProducts products={related as Parameters<typeof RelatedProducts>[0]['products']} />
          </div>
        )}
      </div>
    </div>
  )
}
