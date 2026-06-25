import React from "react"
import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/product/ProductDetails"
import { ProductImages } from "@/components/product/ProductImages"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { getCachedProductPageData } from "@/lib/productPage"
import type { Metadata } from "next"

export const revalidate = 60

interface Props {
  params: { category: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCachedProductPageData(params.slug)
  if (!data) return { title: "Product Not Found | AARU" }
  const product = data.product
  return {
    title: `${product.metaTitle || product.name} | AARU`,
    description: product.metaDescription || product.description.substring(0, 160),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const data = await getCachedProductPageData(params.slug)

  if (!data) {
    notFound()
  }

  const { product, related } = data

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          <ProductImages
            images={product.images as { id: string; imageUrl: string; altText?: string | null }[]}
          />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductDetails product={product as Parameters<typeof ProductDetails>[0]["product"]} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <div className="mb-8">
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
                You May Also Love
              </span>
              <h2 className="font-display text-2xl font-semibold text-dark">Related Pieces</h2>
            </div>
            <RelatedProducts products={related as Parameters<typeof RelatedProducts>[0]["products"]} />
          </div>
        )}
      </div>
    </div>
  )
}
