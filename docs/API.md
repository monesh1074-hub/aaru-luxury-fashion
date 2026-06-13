# API Reference — AARU Luxury Fashion

All endpoints live under the `/api` base path and return JSON responses.

**Standard success response:**
```json
{ "success": true, "data": {} }
```

**Standard error response:**
```json
{ "success": false, "message": "Error description" }
```

**Authentication:** Protected endpoints require either:
- Cookie: `aaru_auth_token=<jwt>`
- Header: `Authorization: Bearer <jwt>`

---

## Authentication — `/api/auth`

### `POST /api/auth/register`
Register a new user account.

**Request body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "mobile": "9876543210",
  "password": "SecurePass@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your mobile number"
}
```

---

### `POST /api/auth/send-otp`
Send or resend an OTP to a mobile number.

**Request body:**
```json
{
  "mobile": "9876543210",
  "purpose": "REGISTER" // or "LOGIN" | "FORGOT_PASSWORD"
}
```

**Response (200):**
```json
{ "success": true, "message": "OTP sent successfully" }
```

---

### `POST /api/auth/verify-otp`
Verify an OTP and complete login / registration.

**Request body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456",
  "purpose": "REGISTER"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "USER" },
  "cart": [],
  "wishlist": []
}
```
Sets cookie: `aaru_auth_token` (httpOnly, SameSite=Lax, 7d)

---

### `POST /api/auth/login`
Login with email/mobile and password.

**Request body:**
```json
{
  "identifier": "priya@example.com", // email or mobile
  "password": "SecurePass@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { ... },
  "cart": [],
  "wishlist": []
}
```

---

### `POST /api/auth/logout`
Logout and clear the auth cookie.

**Response (200):**
```json
{ "success": true, "message": "Logged out" }
```
Deletes cookie: `aaru_auth_token`

---

## Products — `/api/products`

### `GET /api/products`
List products with optional filters.

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `category` | `string` | Filter by category slug |
| `search` | `string` | Full-text search |
| `fabric` | `string` | Filter by fabric |
| `occasion` | `string` | Filter by occasion |
| `minPrice` | `number` | Minimum base price |
| `maxPrice` | `number` | Maximum base price |
| `featured` | `boolean` | Featured products only |
| `newArrival` | `boolean` | New arrivals only |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Results per page (default: 12) |

**Response (200):**
```json
{
  "success": true,
  "products": [ { ...product } ],
  "pagination": { "page": 1, "limit": 12, "total": 48, "totalPages": 4 }
}
```

---

### `GET /api/products/[slug]`
Get a single product by slug.

**Response (200):**
```json
{
  "success": true,
  "product": {
    "id": "...",
    "name": "Varanasi Brocade Silk Saree",
    "slug": "varanasi-brocade-silk-saree",
    "images": [ ... ],
    "variants": [ ... ],
    "category": { ... },
    "reviews": [ ... ]
  }
}
```

---

## Categories — `/api/categories`

### `GET /api/categories`
Get all active categories.

**Response (200):**
```json
{
  "success": true,
  "categories": [
    { "id": "...", "name": "Sarees", "slug": "sarees", "children": [] }
  ]
}
```

---

## Cart — `/api/cart`

### `GET /api/cart`
Get current cart items.
- Authenticated users: returns DB-persisted cart
- Guests: uses `sessionId` cookie

### `POST /api/cart`
Add an item to the cart.

**Request body:**
```json
{
  "productId": "...",
  "variantId": "...",
  "quantity": 1
}
```

### `PUT /api/cart`
Update item quantity.

**Request body:**
```json
{
  "productId": "...",
  "variantId": "...",
  "quantity": 3
}
```

### `DELETE /api/cart`
Remove an item from the cart.

**Query params:** `productId`, `variantId`

---

## Wishlist — `/api/wishlist`

> 🔒 Requires authentication

### `GET /api/wishlist`
Get the authenticated user's wishlist.

### `POST /api/wishlist`
Add a product to the wishlist.

**Request body:**
```json
{ "productId": "..." }
```

### `DELETE /api/wishlist`
Remove a product from the wishlist.

**Query params:** `productId`

---

## Orders — `/api/orders`

> 🔒 Requires authentication

### `GET /api/orders`
Get orders for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "orders": [ { "id": "...", "orderNumber": "AARU-123456-4321", "status": "PENDING", ... } ]
}
```

### `GET /api/orders/[id]`
Get a single order by ID (must belong to authenticated user).

### `POST /api/orders`
Create a new order.

**Request body:**
```json
{
  "addressId": "...",
  "items": [
    { "productId": "...", "variantId": "...", "quantity": 1, "unitPrice": 18500 }
  ],
  "couponCode": "SAVE10",
  "notes": "Please pack in gift wrap"
}
```

**Response (200):**
```json
{
  "success": true,
  "order": { "id": "...", "orderNumber": "AARU-...", "totalAmount": 16650 },
  "razorpayOrderId": "order_..."
}
```

---

## Payments — `/api/payments`

### `POST /api/payments/create-order`
Create a Razorpay order.

**Request body:**
```json
{ "amount": 16650, "orderId": "..." }
```

**Response (200):**
```json
{
  "success": true,
  "razorpayOrderId": "order_...",
  "amount": 1665000,
  "currency": "INR",
  "keyId": "rzp_..."
}
```

### `POST /api/payments/verify`
Verify Razorpay payment signature and mark order as PAID.

**Request body:**
```json
{
  "orderId": "...",
  "razorpayOrderId": "order_...",
  "razorpayPaymentId": "pay_...",
  "razorpaySignature": "..."
}
```

**Response (200):**
```json
{ "success": true, "message": "Payment verified and order confirmed" }
```

---

## Coupons — `/api/coupons`

### `POST /api/coupons/validate`
Validate a coupon code against an order amount.

**Request body:**
```json
{
  "code": "SAVE10",
  "orderAmount": 25000
}
```

**Response (200):**
```json
{
  "success": true,
  "coupon": { "code": "SAVE10", "discountType": "PERCENTAGE", "discountValue": 10 },
  "discountAmount": 2500
}
```

---

## Addresses — `/api/addresses`

> 🔒 Requires authentication

### `GET /api/addresses`
Get all saved addresses for the authenticated user.

### `POST /api/addresses`
Add a new address.

**Request body:**
```json
{
  "fullName": "Priya Sharma",
  "phone": "9876543210",
  "addressLine1": "12, MG Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001",
  "isDefault": true
}
```

### `PUT /api/addresses/[id]`
Update an existing address.

### `DELETE /api/addresses/[id]`
Delete an address.

---

## Custom Orders — `/api/custom-orders`

### `POST /api/custom-orders`
Submit a bespoke tailoring request.

**Request body:**
```json
{
  "name": "Ananya Reddy",
  "email": "ananya@example.com",
  "phone": "9876543210",
  "occasion": "Wedding",
  "garmentType": "Lehenga",
  "fabricPreference": "Banarasi Silk",
  "colorPreference": "Ivory with Gold",
  "measurements": {
    "bust": 36,
    "waist": 30,
    "hips": 38,
    "height": 165
  },
  "referenceImageUrls": ["https://res.cloudinary.com/..."],
  "notes": "Add mirror work on borders"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Custom order submitted successfully",
  "customOrderId": "..."
}
```

---

## Upload — `/api/upload`

> 🔒 Requires authentication (Admin for product images)

### `POST /api/upload`
Upload an image to Cloudinary.

**Request:** `multipart/form-data` with `file` field (JPEG, PNG, WebP).

**Response (200):**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/aaru-luxury/image/upload/...",
  "publicId": "aaru/products/abc123",
  "width": 1200,
  "height": 1600
}
```

---

## Admin — `/api/admin`

> 🔒 Requires `ADMIN` role

### `GET /api/admin/dashboard`
Get dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 1250000,
    "totalOrders": 84,
    "pendingOrders": 12,
    "totalCustomers": 230,
    "newCustomersThisMonth": 18
  }
}
```

---

### `GET /api/admin/customers`
List customers with search and pagination.

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | `string` | Search by name, email, or mobile |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Per page (default: 50, max: 100) |

**Response (200):**
```json
{
  "success": true,
  "customers": [
    {
      "id": "...",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "mobile": "9876543210",
      "role": "USER",
      "isVerified": true,
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "ordersCount": 3
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 230, "totalPages": 5 }
}
```

---

### Admin Products

#### `GET /api/admin/products`
List all products (including inactive) with pagination.

#### `POST /api/admin/products`
Create a new product with images and variants.

#### `PUT /api/admin/products/[id]`
Update a product.

#### `DELETE /api/admin/products/[id]`
Soft-delete a product (`isActive = false`).

---

### Admin Orders

#### `GET /api/admin/orders`
List all orders with status filters.

#### `PUT /api/admin/orders/[id]`
Update order status and/or add shipment information.

**Request body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "IND123456789",
  "courierName": "Delhivery",
  "trackingUrl": "https://delhivery.com/track/IND123456789"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — invalid input |
| `401` | Unauthorized — missing/invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found |
| `429` | Too Many Requests — rate limited |
| `500` | Internal Server Error |
