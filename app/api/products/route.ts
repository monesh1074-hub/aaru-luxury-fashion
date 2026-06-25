import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import {
  getCachedProductsByParams,
  setCachedProductsByParams,
  clearProductsCache,
} from "@/lib/productsCache"
import { resolveCategorySlug } from "@/lib/categorySlugs"
import { queryProductsList, type ProductListFilters } from "@/lib/productsList"

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
    const rawCategorySlug = searchParams.get("category")
    const categorySlug = rawCategorySlug ? resolveCategorySlug(rawCategorySlug) : null
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
    const readyToShip = searchParams.get("readyToShip")
    const onSale = searchParams.get("sale")
    const colorsParam = [
      ...searchParams.getAll("colors"),
      ...searchParams.getAll("colors[]"),
    ]
    const sort = searchParams.get("sort")
    const limit = parseInt(searchParams.get("limit") || "12")
    const page = parseInt(searchParams.get("page") || "1")

    const cacheParams: Record<string, unknown> = {
      category: categorySlug,
      search,
      priceMin: minPrice,
      priceMax: maxPrice,
      sizes: sizesParam,
      fabrics: fabricsParam,
      occasions: occasionsParam,
      colors: colorsParam,
      readyToShip: readyToShip === "true" ? true : undefined,
      sale: onSale === "true" ? true : undefined,
      sort,
      limit,
      page,
    }

    const cachedData = getCachedProductsByParams(cacheParams)
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Cache": "HIT",
        },
      })
    }

    const listFilters: ProductListFilters = {
      category: categorySlug || undefined,
      search: search || undefined,
      priceMin: minPrice,
      priceMax: maxPrice,
      sizes: sizesParam.length ? sizesParam : undefined,
      fabrics: fabricsParam.length ? fabricsParam : undefined,
      occasions: occasionsParam.length ? occasionsParam : undefined,
      colors: colorsParam.length ? colorsParam : undefined,
      readyToShip: readyToShip === "true" ? true : undefined,
      sale: onSale === "true" ? true : undefined,
      sort: sort || undefined,
      limit,
      page,
    }

    const responseData = await queryProductsList(listFilters)
    setCachedProductsByParams(cacheParams, responseData)

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    })
  } catch (error: unknown) {
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
