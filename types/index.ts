export type UserRole = "USER" | "ADMIN"

export interface User {
  id: string
  name: string
  email: string
  mobile: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface Address {
  id: string
  userId: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  imageUrl?: string | null
  isActive: boolean
  sortOrder: number
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText?: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: string
  productId: string
  size: string
  color: string
  stockQty: number
  sku: string
  additionalPrice: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  basePrice: number
  salePrice?: number | null
  fabric?: string | null
  occasion?: string | null
  isCustomizable: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isActive: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  createdAt: string
  category?: Category
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export interface CartItem {
  id: string
  userId?: string | null
  sessionId?: string | null
  productId: string
  variantId: string
  quantity: number
  product: Product
  variant: ProductVariant
}

export interface Coupon {
  id: string
  code: string
  discountType: "PERCENTAGE" | "FIXED"
  discountValue: number
  minOrderAmount: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
  variant?: ProductVariant
}

export interface Payment {
  id: string
  orderId: string
  paymentGateway: string
  gatewayTransactionId?: string | null
  gatewayOrderId?: string | null
  amount: number
  currency: string
  method?: string | null
  status: "PENDING" | "SUCCESS" | "FAILED"
  paidAt?: string | null
}

export interface Shipment {
  id: string
  orderId: string
  courierName?: string | null
  trackingNumber?: string | null
  trackingUrl?: string | null
  status: "PENDING" | "DISPATCHED" | "IN_TRANSIT" | "DELIVERED"
  estimatedDelivery?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  addressId: string
  subtotal: number
  discountAmount: number
  couponId?: string | null
  shippingCharge: number
  gstAmount: number
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentStatus: "UNPAID" | "PAID" | "FAILED" | "REFUNDED"
  notes?: string | null
  createdAt: string
  updatedAt: string
  address?: Address
  user?: User
  items: OrderItem[]
  payments?: Payment[]
  shipments?: Shipment[]
}

export interface Review {
  id: string
  productId: string
  userId: string
  orderId?: string | null
  rating: number
  title?: string | null
  body: string
  isApproved: boolean
  createdAt: string
  user?: User
}

export interface CustomOrder {
  id: string
  userId?: string | null
  name: string
  email: string
  phone: string
  occasion: string
  garmentType: string
  fabricPreference?: string | null
  colorPreference?: string | null
  measurements: Record<string, string | number>
  referenceImageUrls: string[]
  notes?: string | null
  status: "PENDING" | "REVIEWED" | "APPROVED" | "COMPLETED" | "CANCELLED"
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "INFO" | "ORDER_STATUS" | "PROMOTION"
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
