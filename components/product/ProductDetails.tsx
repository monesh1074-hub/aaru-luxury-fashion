"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Ruler, Shield, Truck } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { Product, ProductVariant } from "@/types"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "../ui/Button"
import { Toast } from "../ui/Toast"
import axios from "axios"

interface ProductDetailsProps {
  product: Product
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addItem, loading: cartLoading } = useCart()
  const { items, toggleItem, removeItem, addItem: addWishlist } = useWishlistStore()
  const { isAuthenticated, token } = useAuthStore()

  // Extract unique sizes and colors
  const variants = product.variants || []
  const sizes = Array.from(new Set(variants.map((v) => v.size)))
  const colors = Array.from(new Set(variants.map((v) => v.color)))

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(colors[0] || "")
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Find variant matching current size + color
  useEffect(() => {
    const match = variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    )
    setSelectedVariant(match || variants[0] || null)
  }, [selectedSize, selectedColor, variants])

  const isWishlisted = items.some((item) => item.productId === product.id)

  const handleWishlist = async () => {
    const dummyItem = {
      id: Math.random().toString(),
      userId: "",
      productId: product.id,
      product,
      createdAt: new Date().toISOString(),
    }
    if (isWishlisted) {
      removeItem(product.id)
      Toast.success("Removed from wishlist")
    } else {
      addWishlist(dummyItem)
      Toast.success("Added to wishlist")
    }
    if (isAuthenticated) {
      try {
        await axios.post(
          "/api/wishlist",
          { productId: product.id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.error("Failed to sync wishlist:", err)
      }
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      Toast.error("Please select a variant")
      return
    }
    try {
      await addItem(product, selectedVariant, quantity)
      Toast.success("Added to cart successfully")
    } catch (e) {
      Toast.error("Failed to add item to cart")
    }
  }

  const basePrice = product.salePrice || product.basePrice
  const additionalPrice = selectedVariant?.additionalPrice || 0
  const totalPrice = basePrice + additionalPrice

  return (
    <div className="space-y-8 font-body text-text-primary">
      {/* 1. Header Details */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold block">
          {product.category?.name}
        </span>
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center space-x-4">
          <span className="font-accent text-xl md:text-2xl text-gold font-bold">
            {formatPrice(totalPrice)}
          </span>
          {product.salePrice && (
            <span className="font-accent text-sm md:text-base text-text-secondary line-through">
              {formatPrice(product.basePrice + additionalPrice)}
            </span>
          )}
        </div>
      </div>

      <hr className="border-border" />

      {/* 2. Fabric & Occasion Meta */}
      <div className="grid grid-cols-2 gap-4 text-xs tracking-wider uppercase text-text-secondary">
        <div>
          <span className="font-bold text-dark block mb-1">Fabric</span>
          <span>{product.fabric || "Pure Indian Silk"}</span>
        </div>
        <div>
          <span className="font-bold text-dark block mb-1">Occasion</span>
          <span>{product.occasion || "Festive Wear"}</span>
        </div>
      </div>

      {/* 3. Variant Selectors */}
      <div className="space-y-6">
        {/* Colors */}
        {colors.length > 0 && colors[0] !== "" && (
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block">
              Color: <span className="text-dark font-semibold">{selectedColor}</span>
            </span>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "px-4 py-2 border text-[10px] uppercase tracking-wider font-semibold transition-all duration-300",
                    {
                      "border-dark bg-dark text-background": selectedColor === color,
                      "border-border text-text-secondary hover:border-gold": selectedColor !== color,
                    }
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block">
                Size
              </span>
              {product.isCustomizable && (
                <Link
                  href="/custom"
                  className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-gold hover:text-dark transition-colors duration-200 font-bold"
                >
                  <Ruler size={10} />
                  <span>Custom Size Guide</span>
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 border flex items-center justify-center text-[10px] font-semibold transition-all duration-300",
                    {
                      "border-dark bg-dark text-background": selectedSize === size,
                      "border-border text-text-secondary hover:border-gold": selectedSize !== size,
                    }
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Quantity & Action Buttons */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border h-12">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 text-text-secondary hover:text-dark transition-colors h-full flex items-center"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 text-text-secondary hover:text-dark transition-colors h-full flex items-center"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            loading={cartLoading}
            className="flex-1 h-12 bg-dark text-background hover:bg-gold hover:text-dark uppercase font-semibold text-xs tracking-widest transition-all duration-300"
          >
            Add To Cart
          </Button>
        </div>

        {/* Add to Wishlist */}
        <Button
          onClick={handleWishlist}
          variant="outline"
          className="w-full h-12 border-border text-dark hover:bg-border/20 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Heart size={14} className={cn({ "fill-gold text-gold border-none": isWishlisted })} />
          <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
        </Button>
      </div>

      <hr className="border-border" />

      {/* 5. Product Story/Description */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-widest font-bold text-text-secondary">
          The Craft Story
        </h4>
        <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
          {product.description}
        </p>
      </div>

      {/* 6. Luxury Services highlights */}
      <div className="border border-border/60 bg-border/5 p-4 space-y-3 text-[10px] uppercase tracking-wider text-text-secondary">
        <div className="flex items-center space-x-2.5">
          <Truck size={12} className="text-gold" />
          <span>Free Express Shipping across India</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Shield size={12} className="text-gold" />
          <span>100% Authentic Handloom Mark Guarantee</span>
        </div>
      </div>
    </div>
  )
}
