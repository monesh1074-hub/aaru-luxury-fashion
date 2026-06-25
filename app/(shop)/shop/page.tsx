import React from "react"
import ShopPageContent from "./ShopPageContent"
import { getCachedProductsList } from "@/lib/productsList"

export const revalidate = 60

interface ShopPageProps {
  searchParams: { readyToShip?: string; sale?: string; sort?: string }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sort = searchParams.sort || "newest"
  const readyToShip = searchParams.readyToShip === "true"
  const sale = searchParams.sale === "true"

  let initialData = { products: [] as Awaited<ReturnType<typeof getCachedProductsList>>["products"], total: 0 }
  try {
    const result = await getCachedProductsList({
      sort,
      readyToShip: readyToShip || undefined,
      sale: sale || undefined,
    })
    initialData = { products: result.products, total: result.total }
  } catch (error) {
    console.error("Shop page prefetch error:", error)
  }

  return (
    <ShopPageContent
      key={`${readyToShip}-${sale}-${sort}`}
      readyToShip={readyToShip}
      sale={sale}
      sort={sort}
      initialData={initialData}
    />
  )
}
