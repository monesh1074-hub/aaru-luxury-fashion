export const WHATSAPP_NUMBER = "919999999999"
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi AARU Luxury Fashion, I would like to know more about your collections.")}`
export const INSTAGRAM_URL = "https://www.instagram.com/houseofaaru6?utm_source=qr"

export const BRAND_VALUES = [
  "Ethical",
  "Sustainable",
  "Handcrafted",
  "Artisan Made",
  "Slow Fashion",
  "Homegrown",
] as const

export const SECONDARY_NAV = [
  { label: "Just In", href: "/shop?sort=newest" },
  { label: "Designer Wear", href: "/shop/designer-sarees" },
  { label: "Collections", href: "/shop?collection=featured" },
  { label: "Categories", href: "/shop" },
  { label: "Ready To Ship", href: "/shop?readyToShip=true" },
  { label: "Sarees – Ready To Ship", href: "/shop/sarees?readyToShip=true" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Shop The Look", href: "/#shop-the-look" },
] as const

export const FEATURED_COLLECTIONS = [
  {
    title: "Designer Wear",
    tagline: "Curated couture ensembles",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    href: "/shop/designer-sarees",
  },
  {
    title: "Sarees",
    tagline: "Heritage handloom brocades",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    href: "/shop/sarees",
  },
  {
    title: "Lehengas",
    tagline: "Bridal & occasion couture",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    href: "/shop/occasion-wear",
  },
  {
    title: "Dresses",
    tagline: "Modern ethnic silhouettes",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    href: "/shop/designer-sarees",
  },
  {
    title: "Co-Ords",
    tagline: "Coordinated luxury sets",
    image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80",
    href: "/shop/festive-collections",
  },
  {
    title: "Ready To Ship",
    tagline: "Dispatch within 48 hours",
    image: "https://images.unsplash.com/photo-1617629633317-7886a4b4d2f0?auto=format&fit=crop&w=800&q=80",
    href: "/shop?readyToShip=true",
  },
] as const

export const SHOP_CATEGORIES = [
  { name: "Sarees", slug: "sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80" },
  { name: "Lehengas", slug: "occasion-wear", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80" },
  { name: "Dresses", slug: "designer-sarees", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80" },
  { name: "Kurtas", slug: "designer-sarees", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
  { name: "Co-Ords", slug: "festive-collections", image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80" },
  { name: "Designer Wear", slug: "designer-sarees", image: "https://images.unsplash.com/photo-1617629633317-7886a4b4d2f0?auto=format&fit=crop&w=600&q=80" },
] as const

export const FEATURED_DESIGNERS = [
  {
    name: "Moni",
    collectionCount: 24,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    href: "/aaru-by-moni",
  },
  {
    name: "The Sixth Element",
    collectionCount: 18,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    href: "/sixth-element",
  },
  {
    name: "Heritage Atelier",
    collectionCount: 32,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    href: "/shop/sarees",
  },
] as const

export const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    rating: 5,
    review: "The Banarasi saree I ordered exceeded every expectation. The zari work is exquisite and the drape is absolutely divine.",
  },
  {
    name: "Ananya Reddy",
    rating: 5,
    review: "AARU's bespoke lehenga for my wedding was a dream come true. Moni and her team understood my vision perfectly.",
  },
  {
    name: "Kavitha Menon",
    rating: 5,
    review: "Finally, a luxury brand that honours Indian craftsmanship without compromising on modern elegance. Truly homegrown luxury.",
  },
] as const

export const INSTAGRAM_POSTS = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1617629633317-7886a4b4d2f0?auto=format&fit=crop&w=400&q=80",
] as const

export const SHOP_THE_LOOK = [
  {
    title: "Festive Elegance",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
    products: [
      { name: "Gota Patti Lehenga", href: "/shop/occasion-wear/gota-patti-silk-choli-lehenga", x: 45, y: 55 },
      { name: "Heritage Saree", href: "/shop/sarees", x: 25, y: 40 },
    ],
  },
  {
    title: "Evening Soirée",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
    products: [
      { name: "Anarkali Gown", href: "/shop/designer-sarees/avadh-floral-hand-embroidered-anarkali", x: 50, y: 50 },
    ],
  },
] as const

export const COLLECTION_BANNERS: Record<string, { title: string; description: string; image: string }> = {
  sarees: {
    title: "Heritage Sarees",
    description: "Timeless handloom brocades woven with royal zari, celebrating centuries of Indian textile artistry.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
  },
  "designer-sarees": {
    title: "Designer Wear",
    description: "Contemporary couture that bridges heritage craftsmanship with modern luxury silhouettes.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80",
  },
  "occasion-wear": {
    title: "Lehengas & Occasion Wear",
    description: "Statement ensembles crafted for weddings, celebrations, and moments that deserve to be remembered.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1400&q=80",
  },
}

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Best Selling" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "New Arrivals" },
] as const

export const POPULAR_SEARCHES = [
  { label: "Heritage Sarees", href: "/shop/sarees" },
  { label: "Designer Lehengas", href: "/shop/occasion-wear" },
  { label: "Banarasi Silk", href: "/search?q=banarasi" },
  { label: "Ready To Ship", href: "/shop?readyToShip=true" },
  { label: "Designer Wear", href: "/shop/designer-sarees" },
  { label: "Bridal Collection", href: "/shop/occasion-wear" },
] as const
