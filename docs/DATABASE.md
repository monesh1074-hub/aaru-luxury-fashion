# Database Schema — AARU Luxury Fashion

This document provides detailed documentation for every model in `prisma/schema.prisma`.

**Database:** PostgreSQL  
**ORM:** Prisma 5

---

## Enums

### `Role`
| Value | Description |
|-------|-------------|
| `USER` | Standard customer account |
| `ADMIN` | Platform administrator |

---

## Models

### `User`
Represents a registered customer or admin.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `name` | `String` | — | Display name |
| `email` | `String` | — | Unique email address |
| `mobile` | `String` | — | Unique mobile number |
| `passwordHash` | `String` | — | bcrypt-hashed password |
| `role` | `Role` | `USER` | Account role |
| `isVerified` | `Boolean` | `false` | Mobile OTP verified |
| `isActive` | `Boolean` | `true` | Soft-delete flag |
| `createdAt` | `DateTime` | `now()` | Registration date |
| `updatedAt` | `DateTime` | auto | Last updated |

**Relations:** `addresses`, `otps`, `wishlist`, `cartItems`, `orders`, `reviews`, `customOrders`, `notifications`

---

### `OtpVerification`
Stores time-limited OTP codes for mobile verification.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Primary key |
| `userId` | `String` | FK → User |
| `otpCode` | `String` | The OTP code |
| `purpose` | `String` | `REGISTER` / `LOGIN` / `FORGOT_PASSWORD` |
| `expiresAt` | `DateTime` | Expiry timestamp |
| `isUsed` | `Boolean` | Whether OTP has been consumed |
| `createdAt` | `DateTime` | Creation time |

---

### `Address`
Saved delivery addresses for a user.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `userId` | `String` | — | FK → User |
| `fullName` | `String` | — | Recipient name |
| `phone` | `String` | — | Contact phone |
| `addressLine1` | `String` | — | Street address |
| `addressLine2` | `String?` | — | Optional second line |
| `city` | `String` | — | City |
| `state` | `String` | — | State |
| `pincode` | `String` | — | PIN code |
| `country` | `String` | `"India"` | Country |
| `isDefault` | `Boolean` | `false` | Default address flag |
| `createdAt` | `DateTime` | `now()` | Creation time |

---

### `Category`
Supports hierarchical (parent–child) product categories.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `name` | `String` | — | Category name |
| `slug` | `String` | — | URL-safe unique slug |
| `description` | `String?` | — | Optional description |
| `parentId` | `String?` | — | Self-referential parent FK |
| `imageUrl` | `String?` | — | Category banner image |
| `isActive` | `Boolean` | `true` | Visibility flag |
| `sortOrder` | `Int` | `0` | Display ordering |
| `createdAt` | `DateTime` | `now()` | Creation time |

**Relations:** `parent` (self), `children` (self), `products`

---

### `Product`
Core product entity with SEO and customisation support.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `name` | `String` | — | Product name |
| `slug` | `String` | — | Unique URL slug |
| `description` | `String` | — | Full description |
| `categoryId` | `String` | — | FK → Category |
| `basePrice` | `Float` | — | Standard price (INR) |
| `salePrice` | `Float?` | — | Optional discounted price |
| `fabric` | `String?` | — | Fabric material |
| `occasion` | `String?` | — | Suitable occasion |
| `isCustomizable` | `Boolean` | `false` | Bespoke ordering allowed |
| `isFeatured` | `Boolean` | `false` | Homepage feature flag |
| `isNewArrival` | `Boolean` | `false` | New arrivals section |
| `isActive` | `Boolean` | `true` | Listing visibility |
| `metaTitle` | `String?` | — | SEO title |
| `metaDescription` | `String?` | — | SEO description |
| `createdAt` | `DateTime` | `now()` | Creation time |
| `updatedAt` | `DateTime` | auto | Last modified |

**Relations:** `category`, `images`, `variants`, `wishlists`, `cartItems`, `orderItems`, `reviews`

---

### `ProductImage`
Images associated with a product.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `productId` | `String` | — | FK → Product |
| `imageUrl` | `String` | — | Cloudinary secure URL |
| `altText` | `String?` | — | Accessibility alt text |
| `isPrimary` | `Boolean` | `false` | Primary/hero image flag |
| `sortOrder` | `Int` | `0` | Gallery display order |

---

### `ProductVariant`
A unique combination of size, color, and stock for a product.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `productId` | `String` | — | FK → Product |
| `size` | `String` | — | Size (S, M, L, XL, Free Size…) |
| `color` | `String` | — | Color name |
| `stockQty` | `Int` | `0` | Available stock |
| `sku` | `String` | — | Unique SKU |
| `additionalPrice` | `Float` | `0.0` | Extra cost over base price |

---

### `Wishlist`
Tracks which products a user has saved to their wishlist.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Primary key |
| `userId` | `String` | FK → User |
| `productId` | `String` | FK → Product |
| `createdAt` | `DateTime` | Added date |

**Unique constraint:** `(userId, productId)`

---

### `CartItem`
Shopping cart item supporting both authenticated users and guest sessions.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `userId` | `String?` | — | FK → User (null for guests) |
| `sessionId` | `String?` | — | Guest session identifier |
| `productId` | `String` | — | FK → Product |
| `variantId` | `String` | — | FK → ProductVariant |
| `quantity` | `Int` | `1` | Item quantity |

---

### `Coupon`
Discount coupons with usage limits and expiry.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `code` | `String` | — | Unique coupon code |
| `discountType` | `String` | — | `PERCENTAGE` or `FIXED` |
| `discountValue` | `Float` | — | Discount amount |
| `minOrderAmount` | `Float` | `0.0` | Minimum order to apply |
| `maxUses` | `Int` | `100` | Total usage cap |
| `usedCount` | `Int` | `0` | Current use count |
| `expiresAt` | `DateTime` | — | Expiry date |
| `isActive` | `Boolean` | `true` | Whether coupon is live |
| `createdAt` | `DateTime` | `now()` | Creation time |

---

### `Order`
A customer order with full financial breakdown.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `orderNumber` | `String` | — | Unique display number (e.g., `AARU-123456-4321`) |
| `userId` | `String` | — | FK → User |
| `addressId` | `String` | — | FK → Address |
| `subtotal` | `Float` | — | Pre-discount total |
| `discountAmount` | `Float` | `0.0` | Coupon discount applied |
| `couponId` | `String?` | — | FK → Coupon |
| `shippingCharge` | `Float` | `0.0` | Shipping cost |
| `gstAmount` | `Float` | `0.0` | GST charged |
| `totalAmount` | `Float` | — | Final amount paid |
| `status` | `String` | `PENDING` | `PENDING / PROCESSING / SHIPPED / DELIVERED / CANCELLED` |
| `paymentStatus` | `String` | `UNPAID` | `UNPAID / PAID / FAILED / REFUNDED` |
| `notes` | `String?` | — | Customer notes |
| `createdAt` | `DateTime` | `now()` | Order date |
| `updatedAt` | `DateTime` | auto | Last updated |

---

### `OrderItem`
A line item within an order (snapshot of product details at time of purchase).

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Primary key |
| `orderId` | `String` | FK → Order |
| `productId` | `String` | FK → Product |
| `variantId` | `String` | FK → ProductVariant |
| `productName` | `String` | Snapshot of product name |
| `quantity` | `Int` | Units purchased |
| `unitPrice` | `Float` | Price at time of purchase |
| `totalPrice` | `Float` | `unitPrice × quantity` |

---

### `Payment`
Razorpay payment record linked to an order.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `orderId` | `String` | — | FK → Order |
| `paymentGateway` | `String` | `RAZORPAY` | Payment provider |
| `gatewayTransactionId` | `String?` | — | Razorpay payment ID |
| `gatewayOrderId` | `String?` | — | Razorpay order ID |
| `amount` | `Float` | — | Amount paid (paise) |
| `currency` | `String` | `INR` | Currency code |
| `method` | `String?` | — | `UPI / CARD / NB / WALLET` |
| `status` | `String` | `PENDING` | `PENDING / SUCCESS / FAILED` |
| `paidAt` | `DateTime?` | — | Payment completion timestamp |

---

### `Shipment`
Shipment tracking record for an order.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `orderId` | `String` | — | FK → Order |
| `courierName` | `String?` | — | Courier company name |
| `trackingNumber` | `String?` | — | Tracking number |
| `trackingUrl` | `String?` | — | Courier tracking URL |
| `status` | `String` | `PENDING` | `PENDING / DISPATCHED / IN_TRANSIT / DELIVERED` |
| `estimatedDelivery` | `DateTime?` | — | Estimated delivery date |
| `shippedAt` | `DateTime?` | — | Dispatch timestamp |
| `deliveredAt` | `DateTime?` | — | Delivery timestamp |

---

### `Review`
Product reviews submitted by customers.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `productId` | `String` | — | FK → Product |
| `userId` | `String` | — | FK → User |
| `orderId` | `String?` | — | Optional FK → Order |
| `rating` | `Int` | — | 1–5 star rating |
| `title` | `String?` | — | Review title |
| `body` | `String` | — | Review text |
| `isApproved` | `Boolean` | `false` | Admin approval required |
| `createdAt` | `DateTime` | `now()` | Submission date |

---

### `CustomOrder`
Bespoke tailoring requests with measurements and reference images.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `userId` | `String?` | — | FK → User (optional for guests) |
| `name` | `String` | — | Customer name |
| `email` | `String` | — | Customer email |
| `phone` | `String` | — | Customer phone |
| `occasion` | `String` | — | Occasion for the garment |
| `garmentType` | `String` | — | Type of garment |
| `fabricPreference` | `String?` | — | Preferred fabric |
| `colorPreference` | `String?` | — | Preferred color |
| `measurements` | `Json` | — | Key-value measurement pairs |
| `referenceImageUrls` | `String[]` | — | Cloudinary URLs of reference images |
| `notes` | `String?` | — | Additional instructions |
| `status` | `String` | `PENDING` | `PENDING / REVIEWED / APPROVED / COMPLETED / CANCELLED` |
| `createdAt` | `DateTime` | `now()` | Submission date |

---

### `Notification`
User-facing notifications for orders, promos, and info.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `String` | `uuid()` | Primary key |
| `userId` | `String` | — | FK → User |
| `type` | `String` | — | `INFO / ORDER_STATUS / PROMOTION` |
| `title` | `String` | — | Notification title |
| `message` | `String` | — | Notification body |
| `isRead` | `Boolean` | `false` | Read status |
| `createdAt` | `DateTime` | `now()` | Creation time |

---

## Entity Relationship Overview

```
User ──< Address ──< Order ──< OrderItem >── ProductVariant >── Product
User ──< OtpVerification                                       Product ──< ProductImage
User ──< Wishlist >─────────────────────────────────────────── Product ──< ProductVariant
User ──< CartItem >── ProductVariant >── Product
User ──< Review >── Product
User ──< CustomOrder
User ──< Notification
Order ──< Payment
Order ──< Shipment
Order >── Coupon
Category ──< Product
Category ──< Category (self-referential)
```
