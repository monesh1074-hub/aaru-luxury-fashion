import React from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { CartItem as CartItemType } from "@/types"
import { formatPrice } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
  onUpdateQty: (quantity: number) => void
  onRemove: () => void
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQty, onRemove }) => {
  const { product, variant, quantity } = item
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80"

  const price = product.salePrice || product.basePrice
  const itemPrice = price + variant.additionalPrice

  return (
    <div className="flex gap-4 border-b border-border/60 pb-4 font-body">
      {/* Image Thumbnail */}
      <div className="relative w-20 aspect-[3/4] bg-border/20 overflow-hidden flex-shrink-0">
        <Image src={primaryImage} alt={product.name} fill className="object-cover" />
      </div>

      {/* Meta specifications */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-xs font-semibold tracking-wide text-dark uppercase line-clamp-1">
              {product.name}
            </h4>
            <button
              onClick={onRemove}
              className="text-text-secondary hover:text-error transition-colors duration-200"
              aria-label="Remove item"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <p className="text-[10px] uppercase text-text-secondary tracking-widest mt-1">
            Size: {variant.size} | Color: {variant.color}
          </p>
        </div>

        {/* Counter and Price */}
        <div className="flex justify-between items-end mt-2">
          {/* Mini Counter */}
          <div className="flex items-center border border-border h-8 text-xs">
            <button
              onClick={() => onUpdateQty(quantity - 1)}
              className="px-2.5 text-text-secondary hover:text-dark transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => onUpdateQty(quantity + 1)}
              className="px-2.5 text-text-secondary hover:text-dark transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="font-accent text-sm text-gold font-bold">
            {formatPrice(itemPrice * quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
