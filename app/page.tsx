import React from "react"
import { prisma } from "@/lib/prisma"
import { toIso } from "@/lib/dateUtils"
import { HeroBanner } from "@/components/home/HeroBanner"
import { BrandValuesStrip } from "@/components/home/BrandValuesStrip"
import { BrandStorySection } from "@/components/home/BrandStorySection"
import { FeaturedCollections } from "@/components/home/FeaturedCollections"
import { NewArrivals } from "@/components/home/NewArrivals"
import { ShopByCategory } from "@/components/home/ShopByCategory"
import { DesignerShowcase } from "@/components/home/DesignerShowcase"
import { ReadyToShip } from "@/components/home/ReadyToShip"
import { ShopTheLook } from "@/components/home/ShopTheLook"
import { Testimonials } from "@/components/home/Testimonials"
import { InstagramFeed } from "@/components/home/InstagramFeed"
import { NewsletterSection } from "@/components/home/NewsletterSection"

export const revalidate = 60

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })

    return products.map((prod) => ({
      ...prod,
      createdAt: toIso(prod.createdAt),
      updatedAt: toIso(prod.updatedAt),
      category: prod.category
        ? {
            ...prod.category,
            createdAt: toIso(prod.category.createdAt),
          }
        : undefined,
    }))
  } catch (error) {
    console.warn("DB not ready, returning fallback mock list for homepage render.")
    return [
      {
        id: "mock-1",
        name: "Varanasi Brocade Silk Saree",
        slug: "varanasi-brocade-silk-saree",
        description: "Timeless brocade woven with pure Mulberry silk details.",
        categoryId: "cat-1",
        basePrice: 18500,
        salePrice: 16999,
        fabric: "Pure Katan Silk",
        occasion: "Bridal & Weddings",
        isCustomizable: true,
        isFeatured: true,
        isNewArrival: true,
        isActive: true,
        images: [
          {
            id: "img-1",
            productId: "mock-1",
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
        variants: [
          {
            id: "var-1",
            productId: "mock-1",
            size: "Free Size",
            color: "Crimson Red",
            stockQty: 5,
            sku: "SR-KTN-RED",
            additionalPrice: 0,
          },
        ],
        category: { id: "cat-1", name: "Sarees", slug: "sarees", sortOrder: 1, isActive: true },
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-2",
        name: "Gota Patti Silk Choli Lehenga",
        slug: "gota-patti-silk-choli-lehenga",
        description: "Luxe lehenga with hand-crafted foil borders.",
        categoryId: "cat-2",
        basePrice: 28000,
        salePrice: 25000,
        fabric: "Banarasi Raw Silk",
        occasion: "Bridal & Weddings",
        isCustomizable: true,
        isFeatured: true,
        isNewArrival: true,
        isActive: true,
        images: [
          {
            id: "img-2",
            productId: "mock-2",
            imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
        variants: [
          {
            id: "var-2",
            productId: "mock-2",
            size: "M",
            color: "Maroon Red",
            stockQty: 4,
            sku: "OC-GTP-MAR-M",
            additionalPrice: 0,
          },
        ],
        category: { id: "cat-2", name: "Occasion Wear", slug: "occasion-wear", sortOrder: 2, isActive: true },
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-3",
        name: "Avadh Floral Hand-Embroidered Anarkali",
        slug: "avadh-floral-hand-embroidered-anarkali",
        description: "Part of the Sixth Element series. 3-piece floor-length dress.",
        categoryId: "cat-3",
        basePrice: 15500,
        salePrice: 14500,
        fabric: "Pure Georgette",
        occasion: "Evening Soiree",
        isCustomizable: true,
        isFeatured: true,
        isNewArrival: true,
        isActive: true,
        images: [
          {
            id: "img-3",
            productId: "mock-3",
            imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
        variants: [
          {
            id: "var-3",
            productId: "mock-3",
            size: "S",
            color: "Blush Pink",
            stockQty: 5,
            sku: "DN-AVH-PNK-S",
            additionalPrice: 0,
          },
        ],
        category: { id: "cat-3", name: "Designer Sarees", slug: "designer-sarees", sortOrder: 3, isActive: true },
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <div className="bg-background min-h-screen overflow-hidden pb-16 lg:pb-0">
      <HeroBanner />
      <BrandValuesStrip />
      <BrandStorySection />
      <FeaturedCollections />
      <NewArrivals products={products as any} />
      <ShopByCategory />
      <DesignerShowcase />
      <ReadyToShip products={products as any} />
      <ShopTheLook />
      <Testimonials />
      <InstagramFeed />
      <NewsletterSection />
    </div>
  )
}
