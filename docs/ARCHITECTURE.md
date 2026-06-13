# Architecture Overview — AARU Luxury Fashion

This document describes the architectural patterns, data flows, and key design decisions in the AARU platform.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐│
│  │  React Pages │  │ Zustand Store│  │  Razorpay Checkout JS  ││
│  │  (App Router)│  │  (Persisted) │  │  (External Script)     ││
│  └──────┬───────┘  └──────┬───────┘  └────────────┬───────────┘│
│         │                 │                         │            │
└─────────┼─────────────────┼─────────────────────────┼───────────┘
          │ HTTP / Fetch     │ hydrate                 │ payment
          ▼                 ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 14 Server (Node.js)                  │
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────────────────────────┐│
│  │  middleware.ts  │    │         App Router Pages              ││
│  │  (JWT verify +  │───▶│  Server Components + Client Islands  ││
│  │   role check)   │    └──────────────────────────────────────┘│
│  └─────────────────┘                                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              API Route Handlers (/app/api/...)                ││
│  │  ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌─────────────────┐ ││
│  │  │  /auth   │ │/products│ │  /orders │ │ /payments       │ ││
│  │  └────┬─────┘ └────┬────┘ └────┬─────┘ └────────┬────────┘ ││
│  └───────┼────────────┼───────────┼─────────────────┼──────────┘│
│          │            │           │                 │            │
│  ┌───────┼────────────┼───────────┼─────────────────┼──────────┐│
│  │       │    lib/ Service Layer  │                 │           ││
│  │  ┌────▼────┐  ┌────▼─────┐  ┌─▼────────┐  ┌────▼────────┐ ││
│  │  │ auth.ts │  │prisma.ts │  │razorpay  │  │cloudinary   │ ││
│  │  │ (JWT)   │  │(Singleton│  │.ts       │  │.ts          │ ││
│  │  └─────────┘  └────┬─────┘  └──────────┘  └─────────────┘ ││
│  └───────────────────┼──────────────────────────────────────────┘│
└──────────────────────┼──────────────────────────────────────────┘
                       │ Prisma ORM
                       ▼
          ┌────────────────────────┐
          │   PostgreSQL Database   │
          └────────────────────────┘

External Services:
  Razorpay API ────────────── Payment processing
  Cloudinary CDN ──────────── Image storage & delivery
  Fast2SMS API ────────────── OTP SMS delivery
  SendGrid / SMTP ─────────── Transactional email
```

---

## Authentication & Authorization Flow

```
 User                   Browser               Next.js Server          PostgreSQL
  │                        │                       │                      │
  │── Register ──────────▶│                       │                      │
  │                        │── POST /api/auth/ ──▶│                      │
  │                        │    register           │── findUnique email ─▶│
  │                        │                       │◀─ user data ─────────│
  │                        │                       │── hashPassword()     │
  │                        │                       │── create User ──────▶│
  │                        │                       │── sendOtp(mobile) ──▶ Fast2SMS
  │                        │◀─ { success: true } ──│                      │
  │                        │                       │                      │
  │── Enter OTP ─────────▶│                       │                      │
  │                        │── POST /api/auth/ ──▶│                      │
  │                        │    verify-otp         │── findOtp ──────────▶│
  │                        │                       │◀─ otp record ────────│
  │                        │                       │── signToken(payload) │
  │                        │                       │── Set-Cookie: aaru_auth_token
  │                        │◀─ { token, user } ────│                      │
  │                        │                       │                      │
  │── Navigate to /admin ─▶│                       │                      │
  │                        │── GET /admin ────────▶│                      │
  │                        │                       │── middleware.ts:     │
  │                        │                       │   verifyJwtSignature │
  │                        │                       │   check role=ADMIN   │
  │                        │◀─ Admin Dashboard ────│                      │
```

---

## Shopping Cart Architecture

The cart uses a **dual-persistence** strategy:

### Guest Users
- Cart state is managed in **Zustand** (`cartStore`)
- Persisted to **localStorage** (`aaru-cart-storage`)
- Identified by a `sessionId` cookie for server-side persistence

### Authenticated Users
- On login, server cart is fetched and merged with local cart
- `syncWithServer()` replaces local Zustand state with the merged result
- All mutations (add/remove/update) are synced to PostgreSQL via API calls

```
Guest adds item
      │
      ▼
Zustand cartStore.addItem()
      │
      ├── localStorage updated (persisted)
      │
      └── POST /api/cart (sessionId cookie)
              │
              ▼
           PostgreSQL (CartItem with sessionId)

User logs in
      │
      ▼
GET /api/cart → merge guest + user cart
      │
      ▼
cartStore.syncWithServer(mergedItems)
      │
      ▼
localStorage updated with merged state
```

---

## Order & Payment Flow

```
1. User reviews cart and clicks "Checkout"
2. POST /api/orders         → Creates DB order (status: PENDING, paymentStatus: UNPAID)
                             → Creates Razorpay order via Razorpay SDK
                             → Returns razorpayOrderId

3. Browser opens Razorpay modal (client-side)
4. User completes payment on Razorpay

5. POST /api/payments/verify → Server verifies HMAC-SHA256 signature
                              → Updates Order: paymentStatus = PAID
                              → Creates Payment record in DB
                              → Clears cart
                              → Sends order confirmation email

6. User redirected to /order-success/[orderId]
```

---

## Image Upload Flow

```
Admin selects image in product form
      │
      ▼
POST /api/upload (multipart/form-data)
      │
      ▼
multer parses file buffer in-memory
      │
      ▼
uploadToCloudinary(buffer, mimeType, "aaru/products")
      │
      ▼
Cloudinary transforms + stores image
(quality: auto:good, format: auto, max-width: 1200px)
      │
      ▼
Returns { url, publicId, width, height }
      │
      ▼
Admin form stores secure_url as ProductImage.imageUrl
```

---

## Middleware Route Protection

`middleware.ts` runs on the **Edge Runtime** using Web Crypto APIs (not Node.js `crypto`).

```
Request arrives
      │
      ▼
Is route matched by matcher config?
 [/dashboard/*, /checkout, /order-success/*, /admin/*]
      │
      ├── NO → Next.next() (pass through)
      │
      ▼
Cookie `aaru_auth_token` present?
      │
      ├── NO → Redirect to /login
      │
      ▼
verifyJwtSignature() via Web Crypto HMAC-SHA256
      │
      ├── INVALID/EXPIRED → Delete cookie, redirect to /login
      │
      ▼
Is route /admin/*?
      │
      ├── YES → Check payload.role === "ADMIN"
      │           ├── NOT ADMIN → Redirect to /
      │           └── IS ADMIN → Next.next()
      │
      └── NO → Next.next()
```

---

## Component Architecture

### Page → Component Hierarchy

```
app/page.tsx (Server Component)
├── HeroBanner (Client – animation/swiper)
├── FeaturedCollections (Server – fetches DB)
├── NewArrivals (Client – receives server props)
└── BrandHighlights (Static)

app/(shop)/shop/page.tsx (Server Component)
├── ProductFilters (Client – interactive)
└── ProductGrid
    └── ProductCard[]

app/(admin)/admin/page.tsx (Server Component)
├── DashboardStats
├── RecentOrders
└── LowStockAlert
```

### Shared UI Components (`components/ui/`)
Primitive components built on **Radix UI** for accessibility:
- `Button` — variant-based (primary, ghost, outline)
- `Dialog` — accessible modal
- `Select` — accessible dropdown
- `Slider` — price range filter

---

## Data Fetching Strategy

| Context | Method | Caching |
|---------|--------|---------|
| Homepage products | Server Component + Prisma | `revalidate = 60` (ISR) |
| Product detail pages | Server Component + Prisma | `revalidate = 60` |
| Cart / Wishlist | Client Component + `useCart` / `useWishlist` hooks | Zustand (localStorage) |
| Admin dashboard | Client Component + `axios` | No cache |
| Orders | `useOrders` hook + axios | No cache |

---

## Security Measures

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcrypt with 10 salt rounds |
| JWT signing | HS256 with `JWT_SECRET` env var (7d expiry) |
| JWT verification in middleware | Web Crypto HMAC-SHA256 (Edge-compatible) |
| Admin role check | `payload.role === "ADMIN"` in middleware + every admin API handler |
| Payment signature verification | HMAC-SHA256 of `orderId|paymentId` vs Razorpay signature |
| HTTP security headers | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` |
| CORS | Restricted to `NEXT_PUBLIC_APP_URL` |
| Rate limiting | Custom `rateLimiter.ts` on auth endpoints |
| Console stripping | `removeConsole: true` in production builds |
| Input validation | Zod schemas on all API route inputs |

---

## Performance Optimisations

| Area | Optimisation |
|------|-------------|
| Images | Next.js `<Image>` with AVIF/WebP, Cloudinary CDN, 24h cache TTL |
| Fonts | `next/font/google` with CSS variable injection (zero layout shift) |
| Homepage | ISR with 60-second revalidation |
| Database | Prisma connection pooling via singleton pattern |
| Bundle | `removeConsole` in production, automatic code splitting |
| Animations | Framer Motion with `LazyMotion` for tree-shaking |
