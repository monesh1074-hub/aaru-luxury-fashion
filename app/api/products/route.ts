import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { getCachedProducts, setCachedProducts, clearProductsCache } from "@/lib/productsCache"

function revalidateProductPages() {
  clearProductsCache()
  revalidatePath("/")
  revalidatePath("/shop")
  revalidatePath("/search")
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Retrieve search filters from URL parameters
    const categorySlug = searchParams.get("category")
    const search = searchParams.get("search")
    // Support both priceMin/priceMax (from useProducts hook) and minPrice/maxPrice
    const rawMin = searchParams.get("priceMin") || searchParams.get("minPrice")
    const rawMax = searchParams.get("priceMax") || searchParams.get("maxPrice")
    const minPrice = rawMin ? parseFloat(rawMin) : null
    const maxPrice = rawMax ? parseFloat(rawMax) : null
    // Support repeated query params for multi-select filters
    const sizesParam = [
      ...searchParams.getAll("sizes"),
      ...searchParams.getAll("sizes[]"),
    ]
    const fabricsParam = [
      ...searchParams.getAll("fabrics"),
      ...searchParams.getAll("fabrics[]"),
      ...(searchParams.get("fabric") ? [searchParams.get("fabric")!] : []),
    ]
    const occasionsParam = [
      ...searchParams.getAll("occasions"),
      ...searchParams.getAll("occasions[]"),
      ...(searchParams.get("occasion") ? [searchParams.get("occasion")!] : []),
    ]
    const customizable = searchParams.get("isCustomizable")
    const sort = searchParams.get("sort") // price_asc, price_desc, newest, featured
    const limit = parseInt(searchParams.get("limit") || "12")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Cache lookup using full URL as key
    const cacheKey = req.url
    const cachedData = getCachedProducts(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Cache": "HIT",
        },
      })
    }

    // Build Prisma query condition object
    const where: any = { isActive: true }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    // Apply price filtering on active price (salePrice if exists, otherwise basePrice)
    if (minPrice !== null || maxPrice !== null) {
      const salePriceCond: any = { not: null }
      const basePriceCond: any = {}

      if (minPrice !== null) {
        salePriceCond.gte = minPrice
        basePriceCond.gte = minPrice
      }
      if (maxPrice !== null) {
        salePriceCond.lte = maxPrice
        basePriceCond.lte = maxPrice
      }

      where.AND = [
        {
          OR: [
            {
              salePrice: salePriceCond
            },
            {
              salePrice: null,
              basePrice: basePriceCond
            }
          ]
        }
      ]
    }

    // Size filter (multi-value)
    if (sizesParam.length > 0) {
      where.variants = { some: { size: { in: sizesParam } } }
    }

    if (fabricsParam.length > 0) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: fabricsParam.map((fabric) => ({
            fabric: { contains: fabric, mode: "insensitive" },
          })),
        },
      ]
    }

    if (occasionsParam.length > 0) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: occasionsParam.map((occasion) => ({
            occasion: { contains: occasion, mode: "insensitive" },
          })),
        },
      ]
    }

    if (customizable) {
      where.isCustomizable = customizable === "true"
    }

    // Determine sorting options
    let orderBy: any = { createdAt: "desc" }
    if (sort === "price_asc") {
      orderBy = { basePrice: "asc" }
    } else if (sort === "price_desc") {
      orderBy = { basePrice: "desc" }
    } else if (sort === "featured") {
      orderBy = { isFeatured: "desc" }
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" }
    }

    // Fetch products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          category: true
        },
        orderBy,
        take: limit,
        skip
      }),
      prisma.product.count({ where })
    ])

    const responseData = {
      products,
      total: totalCount, // top-level for useProducts hook compatibility
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
    setCachedProducts(cacheKey, responseData)

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Cache": "MISS",
      },
    })
  } catch (error: any) {
    console.error("Products GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const {
      name,
      slug,
      description,
      categoryId,
      basePrice,
      salePrice,
      fabric,
      occasion,
      isCustomizable,
      isFeatured,
      isNewArrival,
      metaTitle,
      metaDescription,
      images, // array of { imageUrl, altText, isPrimary, sortOrder }
      variants // array of { size, color, stockQty, sku, additionalPrice }
    } = await req.json()

    if (!name || !slug || !description || !categoryId || !basePrice) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the product and nested collections in transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: slug.toLowerCase().trim(),
          description,
          categoryId,
          basePrice: parseFloat(basePrice),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          fabric,
          occasion,
          isCustomizable: !!isCustomizable,
          isFeatured: !!isFeatured,
          isNewArrival: !!isNewArrival,
          metaTitle,
          metaDescription,
          isActive: true
        }
      })

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any) => ({
            productId: product.id,
            imageUrl: img.imageUrl,
            altText: img.altText || "",
            isPrimary: !!img.isPrimary,
            sortOrder: parseInt(img.sortOrder || "0")
          }))
        })
      }

      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: product.id,
            size: v.size,
            color: v.color,
            stockQty: parseInt(v.stockQty || "0"),
            sku: v.sku || `${slug}-${v.size}-${v.color}`.toLowerCase(),
            additionalPrice: parseFloat(v.additionalPrice || "0.0")
          }))
        })
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          variants: true,
          category: true
        }
      })
    })

    clearProductsCache()
    revalidateProductPages()

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    }, { status: 201 })

  } catch (error: any) {
    console.error("Products POST error:", error)
    return NextResponse.json(
      { message: error.code === "P2002" ? "Product slug/SKU already exists" : "Internal Server Error" },
      { status: 500 }
    )
  }
}
