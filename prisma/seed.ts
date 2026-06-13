import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding started...")

  // 1. Clear database
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.otpVerification.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()

  // 2. Create Admin User
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10)
  const admin = await prisma.user.create({
    data: {
      name: "Aaru Admin",
      email: "admin@aaru.com",
      mobile: "9876543210",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isVerified: true,
      isActive: true,
    },
  })
  console.log(`Admin user created: ${admin.email}`)

  // 3. Create Sample User
  const userPasswordHash = await bcrypt.hash("User@123", 10)
  const user = await prisma.user.create({
    data: {
      name: "Kamalesh M",
      email: "kamalesh@aaru.com",
      mobile: "9988776655",
      passwordHash: userPasswordHash,
      role: "USER",
      isVerified: true,
      isActive: true,
      addresses: {
        create: {
          fullName: "Kamalesh M",
          phone: "9988776655",
          addressLine1: "12, Taj Palace Lane",
          addressLine2: "Colaba",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India",
          isDefault: true,
        },
      },
    },
  })
  console.log(`Sample user created: ${user.email}`)

  // 4. Create 6 Categories
  const categories = [
    {
      name: "Sarees",
      slug: "sarees",
      description: "Elegant traditional Indian sarees for all occasions.",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      sortOrder: 1,
    },
    {
      name: "Designer Sarees",
      slug: "designer-sarees",
      description: "Modern bespoke designs and premium embroidered details.",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      sortOrder: 2,
    },
    {
      name: "Dress Materials",
      slug: "dress-materials",
      description: "Unstitched premium fabric sets to tailor to your own fit.",
      imageUrl: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80",
      sortOrder: 3,
    },
    {
      name: "Occasion Wear",
      slug: "occasion-wear",
      description: "Grand lehengas, heavy anarkalis, and sherwanis for grand events.",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
      sortOrder: 4,
    },
    {
      name: "Festive Collections",
      slug: "festive-collections",
      description: "Vibrant ethnic coordinates and easy-going premium sets.",
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      sortOrder: 5,
    },
    {
      name: "Customized Clothing",
      slug: "customized-clothing",
      description: "Bespoke customized garments handcrafted by Moni.",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
      sortOrder: 6,
    },
  ]

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const dbCat = await prisma.category.create({ data: cat })
    createdCategories[cat.slug] = dbCat.id
  }
  console.log("Categories seeded successfully.")

  // 5. Create 12 Products
  const productsData = [
    {
      name: "Varanasi Brocade Katan Silk Saree",
      slug: "varanasi-brocade-katan-silk-saree",
      description: "A timeless masterpiece hand-loomed with pure gold zari and premium Mulberry silk by craftsmen in Varanasi. Features exquisite floral motifs and a grand pallu.",
      categorySlug: "sarees",
      basePrice: 18500,
      salePrice: 16999,
      fabric: "Pure Katan Silk",
      occasion: "Bridal & Weddings",
      isCustomizable: false,
      isFeatured: true,
      isNewArrival: false,
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Free Size", color: "Crimson Red", stockQty: 5, additionalPrice: 0, sku: "SR-KTN-RED" },
        { size: "Free Size", color: "Royal Blue", stockQty: 3, additionalPrice: 500, sku: "SR-KTN-BLU" },
      ],
    },
    {
      name: "Royal Emerald Handloom Chanderi Saree",
      slug: "royal-emerald-handloom-chanderi-saree",
      description: "Lightweight and sheer, this classic Chanderi saree features hand-woven gold bootis and is spun from fine silk and cotton blends for an ethereal texture.",
      categorySlug: "sarees",
      basePrice: 8500,
      salePrice: 7999,
      fabric: "Silk Cotton Chanderi",
      occasion: "Festive wear",
      isCustomizable: false,
      isFeatured: false,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Free Size", color: "Emerald Green", stockQty: 10, additionalPrice: 0, sku: "SR-CHD-GRN" },
      ],
    },
    {
      name: "Kanchipuram Zari Brocade Saree",
      slug: "kanchipuram-zari-brocade-saree",
      description: "Heavily embellished traditional South Indian silk saree in an eye-catching mustard and ruby red color combination. Handloomed with absolute perfection.",
      categorySlug: "sarees",
      basePrice: 24500,
      salePrice: 22999,
      fabric: "Kanchipuram Silk",
      occasion: "Bridal & Weddings",
      isCustomizable: false,
      isFeatured: true,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Free Size", color: "Mustard Gold", stockQty: 4, additionalPrice: 0, sku: "SR-KNC-GLD" },
      ],
    },
    {
      name: "Avadh Floral Hand-Embroidered Anarkali",
      slug: "avadh-floral-hand-embroidered-anarkali",
      description: "Part of the Sixth Element collection. A 3-piece floor-length Georgette Anarkali dress, detailed with delicate Gota Patti border trims and floral Chikankari motifs.",
      categorySlug: "designer-sarees",
      basePrice: 15500,
      salePrice: 14500,
      fabric: "Pure Georgette",
      occasion: "Evening Soiree",
      isCustomizable: true,
      isFeatured: true,
      isNewArrival: false,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "S", color: "Blush Pink", stockQty: 5, additionalPrice: 0, sku: "DN-AVH-PNK-S" },
        { size: "M", color: "Blush Pink", stockQty: 8, additionalPrice: 0, sku: "DN-AVH-PNK-M" },
        { size: "L", color: "Blush Pink", stockQty: 4, additionalPrice: 0, sku: "DN-AVH-PNK-L" },
      ],
    },
    {
      name: "Zardozi Embroidered Velvet Kurta Set",
      slug: "zardozi-embroidered-velvet-kurta-set",
      description: "An elegant midnight-black plush velvet kurta with authentic hand-stitched Dabka and Zardozi work around the neckline. Paired with satin trousers and a silk organza dupatta.",
      categorySlug: "festive-collections",
      basePrice: 12500,
      salePrice: 11000,
      fabric: "Plush Silk Velvet",
      occasion: "Festive Wear",
      isCustomizable: true,
      isFeatured: false,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "S", color: "Midnight Black", stockQty: 3, additionalPrice: 0, sku: "FS-VLV-BLK-S" },
        { size: "M", color: "Midnight Black", stockQty: 6, additionalPrice: 0, sku: "FS-VLV-BLK-M" },
        { size: "L", color: "Midnight Black", stockQty: 5, additionalPrice: 0, sku: "FS-VLV-BLK-L" },
        { size: "XL", color: "Midnight Black", stockQty: 2, additionalPrice: 250, sku: "FS-VLV-BLK-XL" },
      ],
    },
    {
      name: "Gota Patti Silk Choli Lehenga",
      slug: "gota-patti-silk-choli-lehenga",
      description: "Breathtaking hand-crafted wedding lehenga set featuring detailed golden foil embroidery, micro-sequins, and elaborate custom-crafted tassel hangings.",
      categorySlug: "occasion-wear",
      basePrice: 28000,
      salePrice: 25000,
      fabric: "Banarasi Raw Silk",
      occasion: "Bridal & Weddings",
      isCustomizable: true,
      isFeatured: true,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "S", color: "Maroon Red", stockQty: 2, additionalPrice: 0, sku: "OC-GTP-MAR-S" },
        { size: "M", color: "Maroon Red", stockQty: 4, additionalPrice: 0, sku: "OC-GTP-MAR-M" },
        { size: "L", color: "Maroon Red", stockQty: 3, additionalPrice: 0, sku: "OC-GTP-MAR-L" },
      ],
    },
    {
      name: "Ajrakh Handblock Printed Dress Material",
      slug: "ajrakh-handblock-printed-dress-material",
      description: "Premium unstitched Kurta, Shalwar, and Dupatta suit fabric set dyed using natural extracts and woodblock printed in traditional geometric Indigo designs.",
      categorySlug: "dress-materials",
      basePrice: 3800,
      salePrice: 3499,
      fabric: "Organic Modal Silk",
      occasion: "Casual Elegance",
      isCustomizable: false,
      isFeatured: false,
      isNewArrival: false,
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Unstitched", color: "Indigo Blue", stockQty: 20, additionalPrice: 0, sku: "DM-AJR-IND" },
      ],
    },
    {
      name: "Pastel Chikankari Semi-Stitched Suit",
      slug: "pastel-chikankari-semi-stitched-suit",
      description: "Delicate Lucknowi shadow embroidery on semi-stitched organza, with intricate pearls and shadow floral embroidery on the sleeve boundaries.",
      categorySlug: "dress-materials",
      basePrice: 5800,
      salePrice: 4999,
      fabric: "Organza Silk",
      occasion: "Daytime Festive",
      isCustomizable: true,
      isFeatured: false,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Semi-Stitched", color: "Mint Green", stockQty: 15, additionalPrice: 0, sku: "DM-CHk-MNT" },
        { size: "Semi-Stitched", color: "Blush Pink", stockQty: 12, additionalPrice: 0, sku: "DM-CHK-PNK" },
      ],
    },
    {
      name: "Chanderi Silk Golden Gotta Salwar Suit",
      slug: "chanderi-silk-golden-gotta-salwar-suit",
      description: "Elegantly hand-painted flower motifs with subtle golden border gotta layouts, complete with matching pure silk pants and an organza dupatta.",
      categorySlug: "festive-collections",
      basePrice: 9500,
      salePrice: 8500,
      fabric: "Chanderi Silk",
      occasion: "Festive Wear",
      isCustomizable: true,
      isFeatured: true,
      isNewArrival: false,
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "S", color: "Ivory White", stockQty: 6, additionalPrice: 0, sku: "FS-CHD-IVR-S" },
        { size: "M", color: "Ivory White", stockQty: 10, additionalPrice: 0, sku: "FS-CHD-IVR-M" },
        { size: "L", color: "Ivory White", stockQty: 8, additionalPrice: 0, sku: "FS-CHD-IVR-L" },
      ],
    },
    {
      name: "Monochrome Organza Designer Saree",
      slug: "monochrome-organza-designer-saree",
      description: "Modern minimalist organza saree with hand-painted anthracite floral illustrations, paired with a raw-silk designer custom blouse piece.",
      categorySlug: "designer-sarees",
      basePrice: 14500,
      salePrice: 12999,
      fabric: "Glass Organza",
      occasion: "Evening Soiree",
      isCustomizable: true,
      isFeatured: false,
      isNewArrival: false,
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Free Size", color: "Charcoal Grey", stockQty: 8, additionalPrice: 0, sku: "DN-ORG-GRY" },
      ],
    },
    {
      name: "Aaru Handcrafted Silk Banarasi Lehenga",
      slug: "aaru-handcrafted-silk-banarasi-lehenga",
      description: "Stunning festive lehenga handcrafted in Banarasi raw silk, customized down to individual measurements. Adorned with delicate zardozi needlework.",
      categorySlug: "customized-clothing",
      basePrice: 22000,
      salePrice: 19999,
      fabric: "Pure Banarasi Raw Silk",
      occasion: "Festive Wear",
      isCustomizable: true,
      isFeatured: true,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Custom Measurement", color: "Gold Dust", stockQty: 15, additionalPrice: 0, sku: "CS-LEH-GLD" },
      ],
    },
    {
      name: "Royal Heritage Silk Sherwani Ensemble",
      slug: "royal-heritage-silk-sherwani-ensemble",
      description: "Royal sherwani set customized for a perfect fit, featuring gold hand-woven jacquard patterns and hand-carved designer metal button extensions.",
      categorySlug: "customized-clothing",
      basePrice: 26000,
      salePrice: 24500,
      fabric: "Jacquard Raw Silk",
      occasion: "Bridal & Weddings",
      isCustomizable: true,
      isFeatured: false,
      isNewArrival: true,
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      variants: [
        { size: "Custom Measurement", color: "Champagne Gold", stockQty: 10, additionalPrice: 0, sku: "CS-SHR-CHM" },
      ],
    },
  ]

  for (const prod of productsData) {
    const catId = createdCategories[prod.categorySlug]
    if (!catId) continue

    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        categoryId: catId,
        basePrice: prod.basePrice,
        salePrice: prod.salePrice,
        fabric: prod.fabric,
        occasion: prod.occasion,
        isCustomizable: prod.isCustomizable,
        isFeatured: prod.isFeatured,
        isNewArrival: prod.isNewArrival,
        metaTitle: `${prod.name} | AARU Luxury`,
        metaDescription: prod.description.slice(0, 150),
        images: {
          create: [
            { imageUrl: prod.imageUrl, altText: prod.name, isPrimary: true, sortOrder: 1 },
            { imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80", altText: `${prod.name} alternative`, isPrimary: false, sortOrder: 2 },
          ],
        },
        variants: {
          create: prod.variants,
        },
      },
    })
  }
  console.log("Products seeded successfully.")

  // 6. Create Coupons
  await prisma.coupon.create({
    data: {
      code: "AARU10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 5000,
      expiresAt: new Date("2028-12-31T23:59:59Z"),
      isActive: true,
    },
  })

  await prisma.coupon.create({
    data: {
      code: "WELCOME200",
      discountType: "FIXED",
      discountValue: 200,
      minOrderAmount: 2000,
      expiresAt: new Date("2028-12-31T23:59:59Z"),
      isActive: true,
    },
  })
  console.log("Coupons seeded successfully.")

  console.log("Database seeding completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
