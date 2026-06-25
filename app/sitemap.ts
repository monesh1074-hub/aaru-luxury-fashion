import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/story",
    "/aaru-by-moni",
    "/shipping-policy",
    "/returns-policy",
    "/contact",
    "/faq",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    })

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, createdAt: true },
    })

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/shop/${p.category?.slug || "shop"}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${base}/shop/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: "weekly",
      priority: 0.75,
    }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
