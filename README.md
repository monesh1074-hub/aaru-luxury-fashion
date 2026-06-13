# AARU — Luxury Indian Fashion E-Commerce

<div align="center">

**Celebrated handloom sarees, bespoke lehengas, and designer couture.**

Built with Next.js 14 · TypeScript · PostgreSQL · Razorpay · Cloudinary

</div>

---

## ✨ Features

- 🛍️ **Full E-Commerce Flow** — Browse, filter, add to cart, checkout, and track orders
- 🔐 **OTP-Based Authentication** — Mobile number verification via Fast2SMS
- 🧵 **Custom Tailoring Orders** — Bespoke garment requests with measurements and reference images
- 💳 **Razorpay Integration** — Secure payment gateway with webhook signature verification
- 🖼️ **Cloudinary CDN** — Optimised image storage and delivery
- 📦 **Order Management** — Full order lifecycle with shipment tracking
- 🎟️ **Coupon System** — Percentage and fixed-amount discount codes
- ❤️ **Wishlist** — Save favourites, synced across sessions
- 🛒 **Guest Cart** — Cart persisted for guest users with merge-on-login
- 🔔 **Notifications** — Order status and promotional alerts
- 🛡️ **Admin Dashboard** — Manage products, orders, customers, and custom requests

---

## 🚀 Quick Start

```bash
# Clone and install
git clone <repo-url>
cd "AARU Luxury Fashion E-Commerce"
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Set up database
npx prisma migrate dev
npx prisma db seed   # optional: seed sample data

# Run development server
npm run dev
```

Open [https://aaru-luxury-fashion.vercel.app](https://aaru-luxury-fashion.vercel.app) to view the app.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/README.md](./docs/README.md) | Full project documentation |
| [docs/API.md](./docs/API.md) | REST API reference |
| [docs/DATABASE.md](./docs/DATABASE.md) | Database schema reference |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture & data flows |

---

## 🏗️ Tech Stack

| | |
|-|-|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL + Prisma ORM |
| **Styling** | Tailwind CSS + Framer Motion |
| **State** | Zustand (persisted) |
| **Auth** | JWT + bcryptjs + OTP |
| **Payments** | Razorpay |
| **Images** | Cloudinary |
| **Email** | SendGrid (Nodemailer) |
| **SMS** | Fast2SMS |

---

## 📁 Project Structure

```
app/           # Next.js pages and API routes
components/    # Reusable UI components
hooks/         # Custom React hooks
lib/           # Server-side utility modules
prisma/        # Database schema and seed
store/         # Zustand global state
types/         # Shared TypeScript types
docs/          # Project documentation
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`. Key variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Razorpay credentials
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- `FAST2SMS_API_KEY` — For OTP SMS delivery
- `SENDGRID_API_KEY` — For transactional emails

See [docs/README.md](./docs/README.md#environment-variables) for full details.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma db seed` | Seed database with sample data |

---

## 🛡️ Admin Access

Navigate to `/admin` after logging in with an account that has `role: ADMIN`.

Admin features:
- Dashboard with revenue and order stats
- Product CRUD with image/variant management
- Order management and status updates
- Customer listing and search
- Custom tailoring order review

---

*AARU Luxury Fashion — Handcrafted in India 🇮🇳*
