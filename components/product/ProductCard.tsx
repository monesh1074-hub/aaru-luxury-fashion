"use client"

import React, { useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useWishlist } from "@/hooks/useWishlist"
import { Product } from "@/types"
import { formatPrice, cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const wishlisted = isWishlisted(product.id)
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(product)
  }

  const categorySlug = product.category?.slug || "general"
  const price = product.salePrice || product.basePrice
  const productHref = `/shop/${categorySlug}/${product.slug}`

  const prefetchProduct = useCallback(() => {
    router.prefetch(productHref)
  }, [router, productHref])

  return (
    <div className="group relative font-body flex flex-col justify-between h-full bg-background border border-border/25 p-3">
      <Link
        href={productHref}
        prefetch
        onMouseEnter={prefetchProduct}
        onFocus={prefetchProduct}
        className="block relative overflow-hidden bg-border/20 aspect-[3/4] active:opacity-90 transition-opacity duration-150"
      >
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-dark hover:text-gold transition-colors duration-200 shadow-md rounded-full"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={cn({ "fill-gold text-gold": wishlisted })} />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />
        </div>

        {/* Custom fit banner */}
        {product.isCustomizable && (
          <span className="absolute bottom-4 left-4 bg-gold text-dark text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 shadow-sm">
            Bespoke Fit
          </span>
        )}
      </Link>

      {/* Info Content */}
      <div className="pt-4 pb-2 flex flex-col items-center text-center">
        <span className="text-[10px] text-text-secondary uppercase tracking-[0.15em] font-medium mb-1.5 block">
          {product.category?.name || "Couture"}
        </span>
        <h4 className="font-display text-sm font-semibold tracking-wide text-text-primary mb-2 line-clamp-1">
          <Link
            href={productHref}
            prefetch
            onMouseEnter={prefetchProduct}
            className="hover:text-gold transition-colors duration-200"
          >
            {product.name}
          </Link>
        </h4>
        <div className="flex items-center space-x-2.5">
          <span className="font-accent text-base text-gold font-bold">
            {formatPrice(price)}
          </span>
          {product.salePrice && (
            <span className="font-accent text-xs text-text-secondary line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
