import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { getCachedCategories, setCachedCategories, clearCategoriesCache } from "@/lib/categoriesCache"

export async function GET(req: NextRequest) {
  try {
    const cached = getCachedCategories()
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
          "X-Cache": "HIT",
        },
      })
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, sortOrder: true, isActive: true },
    })

    const payload = { success: true, categories }
    setCachedCategories(payload)

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-Cache": "MISS",
      },
    })
  } catch (error) {
    console.error("Categories GET error:", error)
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

    const { name, slug, description, parentId, imageUrl, sortOrder } = await req.json()

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      )
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        description,
        parentId,
        imageUrl,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        isActive: true,
      },
    })

    clearCategoriesCache()

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        category: newCategory,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Category POST error:", error)
    const code = error && typeof error === "object" && "code" in error ? (error as { code: string }).code : null
    return NextResponse.json(
      { message: code === "P2002" ? "Category slug already exists" : "Internal Server Error" },
      { status: 500 }
    )
  }
}
