import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { clearProductsCache } from "@/lib/productsCache"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Retrieve product by ID or Slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id.toLowerCase().trim() }
        ],
        isActive: true
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Single product GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const { id } = params
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
      isActive,
      metaTitle,
      metaDescription,
      images,
      variants
    } = await req.json()

    // Find if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Update in transaction to manage nested edits safely
    const updatedProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: slug?.toLowerCase().trim(),
          description,
          categoryId,
          basePrice: basePrice ? parseFloat(basePrice) : undefined,
          salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : undefined,
          fabric,
          occasion,
          isCustomizable,
          isFeatured,
          isNewArrival,
          isActive,
          metaTitle,
          metaDescription
        }
      })

      // If images array is provided, replace the image collection
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } })
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: any) => ({
              productId: id,
              imageUrl: img.imageUrl,
              altText: img.altText || "",
              isPrimary: !!img.isPrimary,
              sortOrder: parseInt(img.sortOrder || "0")
            }))
          })
        }
      }

      // If variants array is provided, replace the variants collection
      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } })
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: any) => ({
              productId: id,
              size: v.size,
              color: v.color,
              stockQty: parseInt(v.stockQty || "0"),
              sku: v.sku || `${product.slug}-${v.size}-${v.color}`.toLowerCase(),
              additionalPrice: parseFloat(v.additionalPrice || "0.0")
            }))
          })
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          category: true
        }
      })
    })

    clearProductsCache()

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    })
  } catch (error: any) {
    console.error("Product update PUT error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const { id } = params

    // Perform a soft-delete (deactivate) to ensure database order history remains valid
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    clearProductsCache()

    return NextResponse.json({
      success: true,
      message: "Product deactivated successfully"
    })
  } catch (error) {
    console.error("Product delete error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
