import type { Prisma } from "@prisma/client"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { resolveCategorySlug } from "@/lib/categorySlugs"
import { buildProductsCacheKey } from "@/lib/cacheUtils"
import { toIso } from "@/lib/dateUtils"
import type { Product } from "@/types"

export interface ProductListFilters {
  category?: string
  search?: string
  priceMin?: number | null
  priceMax?: number | null
  sizes?: string[]
  fabrics?: string[]
  occasions?: string[]
  colors?: string[]
  readyToShip?: boolean
  sale?: boolean
  sort?: string
  page?: number
  limit?: number
}

export interface ProductListResult {
  products: Product[]
  total: number
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

function appendAnd(where: Prisma.ProductWhereInput, clause: Prisma.ProductWhereInput) {
  const existing = where.AND
    ? Array.isArray(where.AND)
      ? where.AND
      : [where.AND]
    : []
  where.AND = [...existing, clause]
}

function buildWhereClause(filters: ProductListFilters): Prisma.ProductWhereInput {
  const categorySlug = filters.category ? resolveCategorySlug(filters.category) : null
  const where: Prisma.ProductWhereInput = { isActive: true }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  const minPrice = filters.priceMin ?? null
  const maxPrice = filters.priceMax ?? null

  if (minPrice !== null || maxPrice !== null) {
    const salePriceCond: Prisma.FloatNullableFilter = { not: null }
    const basePriceCond: Prisma.FloatFilter = {}

    if (minPrice !== null) {
      salePriceCond.gte = minPrice
      basePriceCond.gte = minPrice
    }
    if (maxPrice !== null) {
      salePriceCond.lte = maxPrice
      basePriceCond.lte = maxPrice
    }

    appendAnd(where, {
      OR: [{ salePrice: salePriceCond }, { salePrice: null, basePrice: basePriceCond }],
    })
  }

  const variantConditions: Prisma.ProductVariantWhereInput[] = []
  if (filters.sizes?.length) {
    variantConditions.push({ size: { in: filters.sizes } })
  }
  if (filters.colors?.length) {
    variantConditions.push({ color: { in: filters.colors } })
  }
  if (filters.readyToShip) {
    variantConditions.push({ stockQty: { gt: 0 } })
  }

  if (variantConditions.length === 1) {
    where.variants = { some: variantConditions[0] }
  } else if (variantConditions.length > 1) {
    variantConditions.forEach((cond) => appendAnd(where, { variants: { some: cond } }))
  }

  if (filters.sale) {
    where.salePrice = { not: null }
  }

  if (filters.fabrics?.length) {
    appendAnd(where, {
      OR: filters.fabrics.map((fabric) => ({
        fabric: { contains: fabric, mode: "insensitive" },
      })),
    })
  }

  if (filters.occasions?.length) {
    appendAnd(where, {
      OR: filters.occasions.map((occasion) => ({
        occasion: { contains: occasion, mode: "insensitive" },
      })),
    })
  }

  return where
}

function buildOrderBy(sort?: string) {
  if (sort === "price_asc") return { basePrice: "asc" as const }
  if (sort === "price_desc") return { basePrice: "desc" as const }
  if (sort === "featured" || sort === "popular") return { isFeatured: "desc" as const }
  return { createdAt: "desc" as const }
}

function serializeProduct(raw: {
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
  category: { id: string; name: string; slug: string } | null
  images: {
    id: string
    productId: string
    imageUrl: string
    altText: string | null
    isPrimary: boolean
    sortOrder: number
  }[]
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
    variants: [],
  }
}

export async function queryProductsList(filters: ProductListFilters): Promise<ProductListResult> {
  const page = filters.page || 1
  const limit = filters.limit || 12
  const skip = (page - 1) * limit
  const where = buildWhereClause(filters)
  const orderBy = buildOrderBy(filters.sort)

  const rows = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy,
    take: limit,
    skip,
  })

  const totalCount = await prisma.product.count({ where })

  const products = rows.map(serializeProduct)

  return {
    products,
    total: totalCount,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  }
}

export function getCachedProductsList(filters: ProductListFilters): Promise<ProductListResult> {
  const key = buildProductsCacheKey(filters as Record<string, unknown>)
  return unstable_cache(() => queryProductsList(filters), ["products-list", key], {
    revalidate: 60,
    tags: ["products-list"],
  })()
}

export function filtersFromSearchParams(
  searchParams: Record<string, string | undefined>
): ProductListFilters {
  return {
    category: searchParams.category,
    search: searchParams.search,
    readyToShip: searchParams.readyToShip === "true",
    sale: searchParams.sale === "true",
    sort: searchParams.sort || "newest",
  }
}
