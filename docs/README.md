# AARU — Luxury Indian Fashion E-Commerce Platform

> Celebrated handloom sarees, bespoke lehengas, and designer couture — built with Next.js 14.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Database Models](#database-models)
7. [API Reference](#api-reference)
8. [Authentication](#authentication)
9. [State Management](#state-management)
10. [Custom Hooks](#custom-hooks)
11. [Admin Panel](#admin-panel)
12. [Payments (Razorpay)](#payments-razorpay)
13. [Image Uploads (Cloudinary)](#image-uploads-cloudinary)
14. [Email & SMS Notifications](#email--sms-notifications)
15. [Deployment](#deployment)

---

## Project Overview

AARU is a full-stack luxury Indian fashion e-commerce platform tailored for handloom sarees, designer lehengas, and bespoke couture. The platform supports:

- **Curated product catalogue** with categories, variants (size & color), and SEO metadata
- **Guest & authenticated shopping** with cart persistence
- **OTP-based authentication** (mobile number via Fast2SMS)
- **Razorpay payment gateway** integration with webhook-based payment verification
- **Custom tailoring orders** with reference image uploads
- **Admin dashboard** for product, order, and customer management
- **Cloudinary** CDN for optimised image storage and delivery

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL (via Prisma ORM 5) |
| Authentication | JWT + bcryptjs + OTP (cookie-based) |
| State Management | Zustand 4 (persisted) |
| Payments | Razorpay |
| Image Storage | Cloudinary |
| Email | Nodemailer / SendGrid |
| SMS | Fast2SMS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| UI Components | Radix UI Primitives |
| Fonts | Playfair Display, DM Sans, Cormorant Garamond |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- Cloudinary account
- Razorpay account (test keys are fine for development)
- Fast2SMS account

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd "AARU Luxury Fashion E-Commerce"

# 2. Install dependencies
npm install

# 3. Copy environment file and fill in your values
cp .env.example .env

# 4. Run database migrations
npx prisma migrate dev

# 5. (Optional) Seed the database
npx prisma db seed

# 6. Start the development server
npm run dev
```

The app will be available at **https://aaru-luxury-fashion.vercel.app**.

---

## Environment Variables

Copy `.env.example` to `.env` and populate the following:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 chars) |
| `NEXTAUTH_SECRET` | NextAuth secret (can be same as JWT_SECRET) |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key (exposed to browser) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SENDGRID_API_KEY` | SendGrid API key for transactional emails |
| `EMAIL_FROM` | Sender email address |
| `EMAIL_SERVER_HOST` | SMTP host (e.g., smtp.sendgrid.net) |
| `EMAIL_SERVER_PORT` | SMTP port (587 for TLS) |
| `EMAIL_SERVER_USER` | SMTP username |
| `EMAIL_SERVER_PASSWORD` | SMTP password |
| `FAST2SMS_API_KEY` | Fast2SMS API key for OTP delivery |
| `NEXT_PUBLIC_APP_URL` | Public base URL (e.g., http://localhost:3000) |

> ⚠️ **Never commit your `.env` file to version control.**

---

## Project Structure

```
AARU Luxury Fashion E-Commerce/
├── app/                        # Next.js App Router
│   ├── (account)/              # User account pages (dashboard, orders, wishlist)
│   ├── (admin)/                # Admin panel pages
│   │   └── admin/
│   │       ├── page.tsx        # Admin dashboard
│   │       ├── products/       # Product management
│   │       ├── orders/         # Order management
│   │       ├── customers/      # Customer management
│   │       └── custom-orders/  # Custom tailoring orders
│   ├── (auth)/                 # Auth pages (login, register, verify OTP)
│   ├── (brand)/                # Brand story pages
│   │   ├── about/
│   │   ├── story/
│   │   ├── aaru-by-moni/
│   │   └── sixth-element/
│   ├── (checkout)/             # Checkout flow
│   ├── (shop)/                 # Shop and search pages
│   ├── api/                    # Next.js API Routes
│   │   ├── admin/              # Admin-only endpoints
│   │   ├── auth/               # Authentication endpoints
│   │   ├── cart/               # Cart management
│   │   ├── categories/         # Category CRUD
│   │   ├── coupons/            # Coupon validation
│   │   ├── custom-orders/      # Custom tailoring order submission
│   │   ├── orders/             # Order management
│   │   ├── payments/           # Razorpay payment integration
│   │   ├── products/           # Product CRUD
│   │   ├── upload/             # Cloudinary image upload
│   │   ├── addresses/          # Saved addresses
│   │   └── wishlist/           # Wishlist management
│   ├── contact/                # Contact page
│   ├── custom/                 # Custom order form page
│   ├── faq/                    # FAQ page
│   ├── privacy-policy/         # Privacy policy page
│   ├── terms/                  # Terms of service page
│   ├── layout.tsx              # Root layout with fonts and providers
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global CSS
│
├── components/                 # Reusable React components
│   ├── admin/                  # Admin panel components
│   ├── auth/                   # Login/Register forms
│   ├── cart/                   # Cart drawer and item cards
│   ├── checkout/               # Checkout steps
│   ├── dashboard/              # User dashboard components
│   ├── home/                   # Homepage sections
│   ├── layout/                 # Navbar, Footer
│   ├── product/                # Product cards, gallery, filters
│   └── ui/                     # Shared UI primitives (Button, Dialog, etc.)
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   └── useProducts.ts
│
├── lib/                        # Server-side utility modules
│   ├── auth.ts                 # JWT sign/verify + getAuthUser()
│   ├── cloudinary.ts           # Cloudinary upload/delete helpers
│   ├── fast2sms.ts             # Fast2SMS OTP sender
│   ├── prisma.ts               # Prisma client singleton
│   ├── rateLimiter.ts          # Simple rate limiting utility
│   ├── razorpay.ts             # Razorpay client + signature verification
│   ├── sendgrid.ts             # SendGrid email sender
│   └── utils.ts                # Shared helpers (formatPrice, formatDate, etc.)
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed script
│
├── store/                      # Zustand global state stores
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── wishlistStore.ts
│
├── types/
│   └── index.ts                # Shared TypeScript type definitions
│
├── middleware.ts               # JWT auth middleware for protected routes
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Database Models

See [DATABASE.md](./DATABASE.md) for full schema documentation.

**Core models:**

| Model | Description |
|-------|-------------|
| `User` | Customers and admin accounts |
| `OtpVerification` | OTP codes for mobile auth |
| `Address` | Saved delivery addresses |
| `Category` | Hierarchical product categories |
| `Product` | Products with SEO metadata |
| `ProductImage` | Product image gallery |
| `ProductVariant` | Size/color/stock/SKU variants |
| `Wishlist` | User wishlists |
| `CartItem` | Persistent cart (guest & auth) |
| `Coupon` | Discount coupons |
| `Order` | Customer orders |
| `OrderItem` | Line items for an order |
| `Payment` | Razorpay payment records |
| `Shipment` | Shipment tracking information |
| `Review` | Product reviews with approval |
| `CustomOrder` | Bespoke tailoring requests |
| `Notification` | User notifications |

---

## API Reference

See [API.md](./API.md) for detailed endpoint documentation.

**Base URL:** `/api`

| Group | Endpoints |
|-------|-----------|
| Auth | `/api/auth/*` |
| Products | `/api/products/*` |
| Categories | `/api/categories/*` |
| Cart | `/api/cart/*` |
| Wishlist | `/api/wishlist/*` |
| Orders | `/api/orders/*` |
| Payments | `/api/payments/*` |
| Coupons | `/api/coupons/*` |
| Addresses | `/api/addresses/*` |
| Custom Orders | `/api/custom-orders/*` |
| Upload | `/api/upload/*` |
| Admin | `/api/admin/*` |

---

## Authentication

AARU uses a custom JWT-based authentication system with OTP verification via mobile number.

### Flow

1. User registers with **name, email, mobile, password**
2. An **OTP is sent** to the mobile number via Fast2SMS
3. User verifies the OTP → a **JWT token** is issued (7-day expiry)
4. The token is stored in an **httpOnly cookie** (`aaru_auth_token`)
5. Subsequent API requests attach the token via the cookie (or `Authorization: Bearer <token>` header)

### Middleware Protection

`middleware.ts` protects the following route groups:

| Route Pattern | Requires |
|---------------|---------|
| `/dashboard/*` | Authenticated user |
| `/checkout` | Authenticated user |
| `/order-success/*` | Authenticated user |
| `/admin/*` | Authenticated user with `ADMIN` role |

Unauthenticated access redirects to `/login`. Non-admin access to admin routes redirects to `/`.

### Auth Utilities (`lib/auth.ts`)

| Function | Description |
|----------|-------------|
| `hashPassword(password)` | Hashes a plain-text password with bcrypt (10 rounds) |
| `comparePassword(password, hash)` | Compares a plain password against a stored hash |
| `signToken(payload)` | Signs a JWT with `{ id, email, role }` payload, expires in 7 days |
| `verifyToken(token)` | Verifies and decodes a JWT; returns `null` on failure |
| `getAuthUser()` | Reads token from cookie or `Authorization` header and returns the authenticated user from DB |

---

## State Management

AARU uses **Zustand** for client-side global state with localStorage persistence.

### Stores

#### `authStore` (`store/authStore.ts`)
Manages authentication state.

| State | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Currently authenticated user |
| `token` | `string \| null` | JWT token |
| `isAuthenticated` | `boolean` | Auth status |

| Action | Description |
|--------|-------------|
| `login(user, token)` | Sets user and token in state |
| `logout()` | Clears auth state |

#### `cartStore` (`store/cartStore.ts`)
Manages the shopping cart. Persisted to localStorage under `aaru-cart-storage`.

| State | Type | Description |
|-------|------|-------------|
| `items` | `CartItem[]` | Cart line items |
| `totalItems` | `number` | Total item count |
| `totalPrice` | `number` | Calculated total price |

| Action | Description |
|--------|-------------|
| `addItem(item)` | Adds item or increments quantity if variant exists |
| `removeItem(productId, variantId)` | Removes a variant from cart |
| `updateQuantity(productId, variantId, qty)` | Updates item quantity |
| `clearCart()` | Empties the cart |
| `syncWithServer(items)` | Replaces cart state with server data (on login) |

#### `wishlistStore` (`store/wishlistStore.ts`)
Manages the wishlist. Persisted to localStorage.

| Action | Description |
|--------|-------------|
| `addItem(item)` | Adds product to wishlist |
| `removeItem(productId)` | Removes product from wishlist |
| `syncWithServer(items)` | Replaces wishlist with server data (on login) |

---

## Custom Hooks

### `useAuth` (`hooks/useAuth.ts`)
Wraps auth store actions with API calls and loading/error state.

```ts
const { user, isAuthenticated, loading, error, register, login, logout, verifyOtp, sendOtp } = useAuth()
```

| Method | Description |
|--------|-------------|
| `register(data)` | Calls `POST /api/auth/register` |
| `login(data)` | Calls `POST /api/auth/login`, syncs cart & wishlist on success |
| `logout()` | Calls `POST /api/auth/logout`, clears cart, redirects to `/` |
| `sendOtp(mobile, purpose)` | Calls `POST /api/auth/send-otp` |
| `verifyOtp(mobile, otp, purpose)` | Calls `POST /api/auth/verify-otp`, logs in on success |

### `useCart` (`hooks/useCart.ts`)
Provides cart actions with server sync.

### `useOrders` (`hooks/useOrders.ts`)
Fetches and manages order data.

### `useProducts` (`hooks/useProducts.ts`)
Fetches product listings with filtering.

---

## Admin Panel

Access at `/admin` (requires `ADMIN` role).

### Dashboard (`/admin`)
High-level stats: total revenue, order counts, new customers.

### Products (`/admin/products`)
- List all products with pagination
- Create / edit / delete products
- Manage images (Cloudinary upload)
- Manage variants (size, color, SKU, stock)

### Orders (`/admin/orders`)
- List all orders with status filters
- View order detail and update order status
- Manage shipment tracking

### Customers (`/admin/customers`)
- List all registered customers
- Search by name, email, or mobile
- View order count per customer

### Custom Orders (`/admin/custom-orders`)
- Review bespoke tailoring requests
- Update request status (PENDING → REVIEWED → APPROVED → COMPLETED)

---

## Payments (Razorpay)

### Flow

1. Client calls `POST /api/payments/create-order` to create a Razorpay order
2. Razorpay checkout modal opens in the browser
3. On payment success, Razorpay returns `{ orderId, paymentId, signature }`
4. Client calls `POST /api/payments/verify` with these values
5. Server verifies the **HMAC-SHA256 signature** using `verifyPaymentSignature()`
6. On success, order `paymentStatus` is updated to `PAID`

### Signature Verification (`lib/razorpay.ts`)

```ts
verifyPaymentSignature(orderId, paymentId, signature): boolean
// Generates: HMAC-SHA256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)
// Compares with the signature provided by Razorpay
```

---

## Image Uploads (Cloudinary)

Images are uploaded to Cloudinary and stored with their `secure_url` in the database.

### Upload Flow

1. Client sends a `multipart/form-data` POST to `/api/upload`
2. Server processes the file with `multer`
3. File buffer is base64-encoded and uploaded via `uploadToCloudinary()`
4. Cloudinary returns a `secure_url` and `public_id`

### Utility Functions (`lib/cloudinary.ts`)

| Function | Description |
|----------|-------------|
| `uploadToCloudinary(buffer, mimeType, folder?)` | Uploads an image buffer to Cloudinary. Default folder: `aaru/products`. Returns `{ url, publicId, width, height }` |
| `deleteFromCloudinary(publicId)` | Deletes an image from Cloudinary by its public ID |

---

## Email & SMS Notifications

### Email (`lib/sendgrid.ts`)
Transactional emails are sent via **SendGrid** using Nodemailer as the transport. Used for:
- Order confirmation
- Password reset

### SMS / OTP (`lib/fast2sms.ts`)
OTPs are sent to the user's registered mobile number via **Fast2SMS**. Used for:
- Registration OTP
- Login OTP
- Password reset OTP

---

## Deployment

### Build

```bash
npm run build
npm run start
```

### Environment

- Set `NODE_ENV=production` — this removes `console.*` calls via the Next.js compiler
- Ensure all environment variables are configured in your hosting provider (Vercel, Railway, etc.)
- Run `npx prisma migrate deploy` before the first production start

### Recommended Platforms

| Platform | Notes |
|----------|-------|
| **Vercel** | Native Next.js support, edge middleware |
| **Railway** | Easy PostgreSQL + Node.js deployment |
| **Render** | Good free tier for PostgreSQL |

### Security Headers

`next.config.js` automatically sets the following headers on all routes:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

CORS is configured for API routes to allow only `NEXT_PUBLIC_APP_URL`.

---

*Documentation generated for AARU Luxury Fashion E-Commerce v1.0.0*
