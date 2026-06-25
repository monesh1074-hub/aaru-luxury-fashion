import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toIso } from "@/lib/dateUtils"
import type { Product } from "@/types"

function serializeProductDetail(raw: NonNullable<Awaited<ReturnType<typeof fetchProductRaw>>>) {
  return {
    ...raw,
    basePrice: Number(raw.basePrice),
    salePrice: raw.salePrice != null ? Number(raw.salePrice) : null,
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt),
    category: raw.category
      ? {
          ...raw.category,
          createdAt: toIso(raw.category.createdAt),
        }
      : null,
    reviews: raw.reviews.map((r) => ({
      ...r,
      createdAt: toIso(r.createdAt),
    })),
    variants: raw.variants.map((v) => ({
      ...v,
      additionalPrice: Number(v.additionalPrice),
    })),
  }
}

function serializeRelatedProduct(raw: {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  basePrice: unknown
  salePrice: unknown
  fabric: string | null
  occasion: string | null
  isCustomizable: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isActive: boolean
  metaTitle: string | null
  metaDescription: string | null
  createdAt: Date | string
  updatedAt: Date | string
  images: Product["images"]
  variants: Product["variants"]
  category: { id: string; name: string; slug: string } | null
}): Product {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    categoryId: raw.categoryId,
    basePrice: Number(raw.basePrice),
    salePrice: raw.salePrice != null ? Number(raw.salePrice) : null,
    fabric: raw.fabric,
    occasion: raw.occasion,
    isCustomizable: raw.isCustomizable,
    isFeatured: raw.isFeatured,
    isNewArrival: raw.isNewArrival,
    isActive: raw.isActive,
    metaTitle: raw.metaTitle,
    metaDescription: raw.metaDescription,
    createdAt: toIso(raw.createdAt),
    category: raw.category
      ? {
          id: raw.category.id,
          name: raw.category.name,
          slug: raw.category.slug,
          isActive: true,
          sortOrder: 0,
        }
      : undefined,
    images: raw.images,
    variants: raw.variants.map((v) => ({
      ...v,
      additionalPrice: Number(v.additionalPrice),
    })),
  }
}

async function fetchProductRaw(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })
}

export type SerializedProductDetail = ReturnType<typeof serializeProductDetail>

export interface ProductPageData {
  product: SerializedProductDetail
  related: Product[]
}

/** Single cached fetch — sequential DB queries to avoid connection pool exhaustion. */
export function getCachedProductPageData(slug: string): Promise<ProductPageData | null> {
  return unstable_cache(
    async () => {
      try {
        const raw = await fetchProductRaw(slug)
        if (!raw) return null

        const relatedRows = await prisma.product.findMany({
          where: { categoryId: raw.categoryId, isActive: true, id: { not: raw.id } },
          include: {
            images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
            variants: true,
            category: { select: { id: true, name: true, slug: true } },
          },
          take: 4,
          orderBy: { createdAt: "desc" },
        })

        return {
          product: serializeProductDetail(raw),
          related: relatedRows.map(serializeRelatedProduct),
        }
      } catch (error) {
        console.error("Product page fetch error:", error)
        return null
      }
    },
    ["product-page", slug],
    { revalidate: 60, tags: [`product-${slug}`] }
  )()
}

/** Metadata-only — reuses the same cache entry as the page. */
export function getCachedProductBySlug(slug: string) {
  return getCachedProductPageData(slug).then((data) => data?.product ?? null)
}

export function getCachedRelatedProducts(categoryId: string, excludeId: string, slug: string) {
  return getCachedProductPageData(slug).then((data) => data?.related ?? [])
}
