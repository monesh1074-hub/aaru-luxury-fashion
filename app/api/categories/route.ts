import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    })

    return NextResponse.json({ success: true, categories })
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
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: newCategory
    }, { status: 201 })

  } catch (error: any) {
    console.error("Category POST error:", error)
    return NextResponse.json(
      { message: error.code === "P2002" ? "Category slug already exists" : "Internal Server Error" },
      { status: 500 }
    )
  }
}
