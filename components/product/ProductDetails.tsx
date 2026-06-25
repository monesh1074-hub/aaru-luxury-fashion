"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Heart, ShoppingBag, Ruler, Shield, Truck, Clock, Droplets, MessageCircle } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { Product, ProductVariant } from "@/types"
import { formatPrice, cn } from "@/lib/utils"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import { Button } from "../ui/Button"
import { Toast } from "../ui/Toast"
import { SizeGuideModal } from "./SizeGuideModal"

interface ProductDetailsProps {
  product: Product
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addItem, loading: cartLoading } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  // Extract unique sizes and colors
  const variants = useMemo(() => product.variants || [], [product.variants])
  const sizes = Array.from(new Set(variants.map((v) => v.size)))
  const colors = Array.from(new Set(variants.map((v) => v.color)))

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(colors[0] || "")
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // Find variant matching current size + color
  useEffect(() => {
    const match = variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    )
    setSelectedVariant(match || variants[0] || null)
  }, [selectedSize, selectedColor, variants])

  const wishlisted = isWishlisted(product.id)

  const handleWishlist = async () => {
    await toggleWishlist(product)
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
  const inStock = (selectedVariant?.stockQty ?? 0) > 0
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi AARU, I'm interested in "${product.name}". Could you share more details?`)}`

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs tracking-wider uppercase text-text-secondary">
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
            <div className="flex flex-wrap gap-2">
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
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-gold hover:text-dark transition-colors duration-200 font-bold"
              >
                <Ruler size={10} />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-[3rem] px-3 py-2 border flex items-center justify-center text-[10px] font-semibold transition-all duration-300 whitespace-nowrap",
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
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
          <Heart size={14} className={cn({ "fill-gold text-gold border-none": wishlisted })} />
          <span>{wishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
        </Button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-semibold"
        >
          <MessageCircle size={16} />
          <span>Chat On WhatsApp</span>
        </a>
      </div>

      <hr className="border-border" />

      {/* 5. Product Story/Description */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-widest font-bold text-text-secondary">
            The Product Story
          </h4>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
            {product.description}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-widest font-bold text-text-secondary">
            The Craft Story
          </h4>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
            Handcrafted by master artisans using time-honoured techniques passed down through generations.
            Each piece reflects the rich textile heritage of India, with meticulous attention to weave,
            drape, and finish.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-widest font-bold text-text-secondary">
            Material Details
          </h4>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
            {product.fabric || "Pure Indian Silk"} — sourced from certified handloom clusters.
            {product.occasion ? ` Ideal for ${product.occasion.toLowerCase()}.` : ""}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-2">
            <Droplets size={12} className="text-gold" />
            Care Instructions
          </h4>
          <ul className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide space-y-1 list-disc list-inside">
            <li>Dry clean only for silk and brocade pieces</li>
            <li>Store in a breathable cotton cover, away from direct sunlight</li>
            <li>Iron on low heat with a protective cloth between fabric and iron</li>
            <li>Avoid contact with perfumes and deodorants on fabric</li>
          </ul>
        </div>
      </div>

      {/* 6. Delivery & Services */}
      <div className="border border-border/60 bg-border/5 p-5 space-y-3 text-[10px] uppercase tracking-wider text-text-secondary">
        <div className="flex items-center space-x-2.5">
          <Clock size={12} className="text-gold" />
          <span>Dispatch within {inStock ? "2–3 business days" : "7–14 business days (made to order)"}</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Truck size={12} className="text-gold" />
          <span>Delivery estimate: 5–7 business days across India</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Shield size={12} className="text-gold" />
          <span>100% Authentic Handloom Mark Guarantee</span>
        </div>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}
