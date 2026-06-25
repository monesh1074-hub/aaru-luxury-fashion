import React from "react"
import { redirect } from "next/navigation"
import CategoryPageContent from "./CategoryPageContent"
import { CATEGORY_SLUG_ALIASES, resolveCategorySlug } from "@/lib/categorySlugs"
import { getCachedProductsList } from "@/lib/productsList"

export const revalidate = 60

interface CategoryPageProps {
  params: { category: string }
  searchParams: { readyToShip?: string; sale?: string }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const normalized = params.category.toLowerCase().trim()
  const resolved = resolveCategorySlug(params.category)

  if (CATEGORY_SLUG_ALIASES[normalized] && resolved !== params.category) {
    const query = new URLSearchParams()
    if (searchParams.readyToShip === "true") query.set("readyToShip", "true")
    if (searchParams.sale === "true") query.set("sale", "true")
    const qs = query.toString()
    redirect(`/shop/${resolved}${qs ? `?${qs}` : ""}`)
  }

  const readyToShip = searchParams.readyToShip === "true"
  const sale = searchParams.sale === "true"

  let initialData = { products: [] as Awaited<ReturnType<typeof getCachedProductsList>>["products"], total: 0 }
  try {
    const result = await getCachedProductsList({
      category: resolved,
      readyToShip: readyToShip || undefined,
      sale: sale || undefined,
      sort: "newest",
    })
    initialData = { products: result.products, total: result.total }
  } catch (error) {
    console.error("Category page prefetch error:", error)
  }

  return (
    <CategoryPageContent
      key={`${resolved}-${readyToShip}-${sale}`}
      category={resolved}
      readyToShip={readyToShip}
      sale={sale}
      initialData={initialData}
    />
  )
}
