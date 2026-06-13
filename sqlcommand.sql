
--  AARU LUXURY FASHION — SUPABASE DATABASE SETUP
--  Paste this ENTIRE script in Supabase → SQL Editor → Run All
--  Creates all 17 tables + seed data (products, admin, coupons)



-- ────────────────────────────────────────────────────────────────
--  SECTION 1 ▸ EXTENSIONS & TYPES
-- ────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ────────────────────────────────────────────────────────────────
--  SECTION 2 ▸ CREATE TABLES
-- ────────────────────────────────────────────────────────────────

-- 1. User
CREATE TABLE IF NOT EXISTS "User" (
  "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"         TEXT        NOT NULL,
  "email"        TEXT        NOT NULL,
  "mobile"       TEXT        NOT NULL,
  "passwordHash" TEXT        NOT NULL,
  "role"         "Role"      NOT NULL DEFAULT 'USER',
  "isVerified"   BOOLEAN     NOT NULL DEFAULT FALSE,
  "isActive"     BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "User_pkey"          PRIMARY KEY ("id"),
  CONSTRAINT "User_email_key"     UNIQUE ("email"),
  CONSTRAINT "User_mobile_key"    UNIQUE ("mobile")
);

-- 2. OtpVerification
CREATE TABLE IF NOT EXISTS "OtpVerification" (
  "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT        NOT NULL,
  "otpCode"   TEXT        NOT NULL,
  "purpose"   TEXT        NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "isUsed"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "OtpVerification_pkey"    PRIMARY KEY ("id"),
  CONSTRAINT "OtpVerification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- 3. Address
CREATE TABLE IF NOT EXISTS "Address" (
  "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"       TEXT        NOT NULL,
  "fullName"     TEXT        NOT NULL,
  "phone"        TEXT        NOT NULL,
  "addressLine1" TEXT        NOT NULL,
  "addressLine2" TEXT,
  "city"         TEXT        NOT NULL,
  "state"        TEXT        NOT NULL,
  "pincode"      TEXT        NOT NULL,
  "country"      TEXT        NOT NULL DEFAULT 'India',
  "isDefault"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Address_pkey"      PRIMARY KEY ("id"),
  CONSTRAINT "Address_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- 4. Category
CREATE TABLE IF NOT EXISTS "Category" (
  "id"          TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"        TEXT        NOT NULL,
  "slug"        TEXT        NOT NULL,
  "description" TEXT,
  "parentId"    TEXT,
  "imageUrl"    TEXT,
  "isActive"    BOOLEAN     NOT NULL DEFAULT TRUE,
  "sortOrder"   INTEGER     NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Category_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "Category_slug_key" UNIQUE ("slug"),
  CONSTRAINT "Category_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "Category"("id")
);

-- 5. Product
CREATE TABLE IF NOT EXISTS "Product" (
  "id"              TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"            TEXT        NOT NULL,
  "slug"            TEXT        NOT NULL,
  "description"     TEXT        NOT NULL,
  "categoryId"      TEXT        NOT NULL,
  "basePrice"       FLOAT8      NOT NULL,
  "salePrice"       FLOAT8,
  "fabric"          TEXT,
  "occasion"        TEXT,
  "isCustomizable"  BOOLEAN     NOT NULL DEFAULT FALSE,
  "isFeatured"      BOOLEAN     NOT NULL DEFAULT FALSE,
  "isNewArrival"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "isActive"        BOOLEAN     NOT NULL DEFAULT TRUE,
  "metaTitle"       TEXT,
  "metaDescription" TEXT,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Product_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "Product_slug_key" UNIQUE ("slug"),
  CONSTRAINT "Product_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
);

-- 6. ProductImage
CREATE TABLE IF NOT EXISTS "ProductImage" (
  "id"        TEXT    NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "productId" TEXT    NOT NULL,
  "imageUrl"  TEXT    NOT NULL,
  "altText"   TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductImage_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- 7. ProductVariant
CREATE TABLE IF NOT EXISTS "ProductVariant" (
  "id"              TEXT    NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "productId"       TEXT    NOT NULL,
  "size"            TEXT    NOT NULL,
  "color"           TEXT    NOT NULL,
  "stockQty"        INTEGER NOT NULL DEFAULT 0,
  "sku"             TEXT    NOT NULL,
  "additionalPrice" FLOAT8  NOT NULL DEFAULT 0.0,
  CONSTRAINT "ProductVariant_pkey"    PRIMARY KEY ("id"),
  CONSTRAINT "ProductVariant_sku_key" UNIQUE ("sku"),
  CONSTRAINT "ProductVariant_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- 8. Wishlist
CREATE TABLE IF NOT EXISTS "Wishlist" (
  "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT        NOT NULL,
  "productId" TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Wishlist_pkey"                PRIMARY KEY ("id"),
  CONSTRAINT "Wishlist_userId_productId_key" UNIQUE ("userId","productId"),
  CONSTRAINT "Wishlist_userId_fkey"
    FOREIGN KEY ("userId")    REFERENCES "User"("id")    ON DELETE CASCADE,
  CONSTRAINT "Wishlist_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- 9. CartItem
CREATE TABLE IF NOT EXISTS "CartItem" (
  "id"        TEXT    NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT,
  "sessionId" TEXT,
  "productId" TEXT    NOT NULL,
  "variantId" TEXT    NOT NULL,
  "quantity"  INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CartItem_userId_fkey"
    FOREIGN KEY ("userId")    REFERENCES "User"("id")           ON DELETE CASCADE,
  CONSTRAINT "CartItem_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")        ON DELETE CASCADE,
  CONSTRAINT "CartItem_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE
);

-- 10. Coupon
CREATE TABLE IF NOT EXISTS "Coupon" (
  "id"             TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "code"           TEXT        NOT NULL,
  "discountType"   TEXT        NOT NULL,
  "discountValue"  FLOAT8      NOT NULL,
  "minOrderAmount" FLOAT8      NOT NULL DEFAULT 0.0,
  "maxUses"        INTEGER     NOT NULL DEFAULT 100,
  "usedCount"      INTEGER     NOT NULL DEFAULT 0,
  "expiresAt"      TIMESTAMPTZ NOT NULL,
  "isActive"       BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Coupon_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "Coupon_code_key" UNIQUE ("code")
);

-- 11. Order
CREATE TABLE IF NOT EXISTS "Order" (
  "id"             TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderNumber"    TEXT        NOT NULL,
  "userId"         TEXT        NOT NULL,
  "addressId"      TEXT        NOT NULL,
  "subtotal"       FLOAT8      NOT NULL,
  "discountAmount" FLOAT8      NOT NULL DEFAULT 0.0,
  "couponId"       TEXT,
  "shippingCharge" FLOAT8      NOT NULL DEFAULT 0.0,
  "gstAmount"      FLOAT8      NOT NULL DEFAULT 0.0,
  "totalAmount"    FLOAT8      NOT NULL,
  "status"         TEXT        NOT NULL DEFAULT 'PENDING',
  "paymentStatus"  TEXT        NOT NULL DEFAULT 'UNPAID',
  "notes"          TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Order_pkey"            PRIMARY KEY ("id"),
  CONSTRAINT "Order_orderNumber_key" UNIQUE ("orderNumber"),
  CONSTRAINT "Order_userId_fkey"
    FOREIGN KEY ("userId")    REFERENCES "User"("id"),
  CONSTRAINT "Order_addressId_fkey"
    FOREIGN KEY ("addressId") REFERENCES "Address"("id"),
  CONSTRAINT "Order_couponId_fkey"
    FOREIGN KEY ("couponId")  REFERENCES "Coupon"("id")
);

-- 12. OrderItem
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"          TEXT   NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"     TEXT   NOT NULL,
  "productId"   TEXT   NOT NULL,
  "variantId"   TEXT   NOT NULL,
  "productName" TEXT   NOT NULL,
  "quantity"    INTEGER NOT NULL,
  "unitPrice"   FLOAT8 NOT NULL,
  "totalPrice"  FLOAT8 NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrderItem_orderId_fkey"
    FOREIGN KEY ("orderId")   REFERENCES "Order"("id")          ON DELETE CASCADE,
  CONSTRAINT "OrderItem_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id"),
  CONSTRAINT "OrderItem_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id")
);

-- 13. Payment
CREATE TABLE IF NOT EXISTS "Payment" (
  "id"                   TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"              TEXT        NOT NULL,
  "paymentGateway"       TEXT        NOT NULL DEFAULT 'RAZORPAY',
  "gatewayTransactionId" TEXT,
  "gatewayOrderId"       TEXT,
  "amount"               FLOAT8      NOT NULL,
  "currency"             TEXT        NOT NULL DEFAULT 'INR',
  "method"               TEXT,
  "status"               TEXT        NOT NULL DEFAULT 'PENDING',
  "paidAt"               TIMESTAMPTZ,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Payment_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);

-- 14. Shipment
CREATE TABLE IF NOT EXISTS "Shipment" (
  "id"                TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"           TEXT        NOT NULL,
  "courierName"       TEXT,
  "trackingNumber"    TEXT,
  "trackingUrl"       TEXT,
  "status"            TEXT        NOT NULL DEFAULT 'PENDING',
  "estimatedDelivery" TIMESTAMPTZ,
  "shippedAt"         TIMESTAMPTZ,
  "deliveredAt"       TIMESTAMPTZ,
  CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Shipment_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);

-- 15. Review
CREATE TABLE IF NOT EXISTS "Review" (
  "id"         TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "productId"  TEXT        NOT NULL,
  "userId"     TEXT        NOT NULL,
  "orderId"    TEXT,
  "rating"     INTEGER     NOT NULL,
  "title"      TEXT,
  "body"       TEXT        NOT NULL,
  "isApproved" BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Review_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
  CONSTRAINT "Review_userId_fkey"
    FOREIGN KEY ("userId")    REFERENCES "User"("id")    ON DELETE CASCADE
);

-- 16. CustomOrder
CREATE TABLE IF NOT EXISTS "CustomOrder" (
  "id"                 TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"             TEXT,
  "name"               TEXT        NOT NULL,
  "email"              TEXT        NOT NULL,
  "phone"              TEXT        NOT NULL,
  "occasion"           TEXT        NOT NULL,
  "garmentType"        TEXT        NOT NULL,
  "fabricPreference"   TEXT,
  "colorPreference"    TEXT,
  "measurements"       JSONB       NOT NULL DEFAULT '{}',
  "referenceImageUrls" TEXT[]      NOT NULL DEFAULT '{}',
  "notes"              TEXT,
  "status"             TEXT        NOT NULL DEFAULT 'PENDING',
  "createdAt"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "CustomOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CustomOrder_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- 17. Notification
CREATE TABLE IF NOT EXISTS "Notification" (
  "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT        NOT NULL,
  "type"      TEXT        NOT NULL,
  "title"     TEXT        NOT NULL,
  "message"   TEXT        NOT NULL,
  "isRead"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);


-- ────────────────────────────────────────────────────────────────
--  SECTION 3 ▸ SEED DATA
-- ────────────────────────────────────────────────────────────────

-- ── Admin User ── (password: Admin@123)
INSERT INTO "User" ("id","name","email","mobile","passwordHash","role","isVerified","isActive")
VALUES (
  'usr-admin-aaru-001',
  'AARU Admin',
  'admin@aaru.com',
  '9000000000',
  '$2a$10$RRQZ/RvHNReu4dcIUUrgYOjBt9B0j6KnAO3UrYWB5xQhq/.XBNsPS',
  'ADMIN',
  TRUE,
  TRUE
) ON CONFLICT ("email") DO NOTHING;

-- ── Categories ──────────────────────────────────────────────────
INSERT INTO "Category" ("id","name","slug","description","sortOrder") VALUES
  ('cat-001','Sarees',              'sarees',              'Traditional & contemporary sarees from across India', 1),
  ('cat-002','Designer Sarees',     'designer-sarees',     'Exclusive designer sarees with bespoke embellishments', 2),
  ('cat-003','Dress Materials',     'dress-materials',     'Premium fabric dress materials for all occasions', 3),
  ('cat-004','Occasion Wear',       'occasion-wear',       'Curated ensembles for weddings and festivities', 4),
  ('cat-005','Festive Collections', 'festive-collections', 'Celebrate every festival in AARU luxury style', 5),
  ('cat-006','Customized Clothing', 'customized-clothing', 'Bespoke tailoring by the House of AARU', 6)
ON CONFLICT ("slug") DO NOTHING;

-- ── Products ────────────────────────────────────────────────────
INSERT INTO "Product"
  ("id","name","slug","description","categoryId","basePrice","salePrice",
   "fabric","occasion","isCustomizable","isFeatured","isNewArrival")
VALUES
  ('prod-001',
   'Varanasi Brocade Silk Saree','varanasi-brocade-silk-saree',
   'A timeless masterpiece woven with pure Mulberry silk and gold zari brocade from the looms of Varanasi. Comes with an unstitched silk blouse piece.',
   'cat-001',18500,16999,'Pure Katan Silk','Bridal & Weddings',TRUE,TRUE,TRUE),

  ('prod-002',
   'Chanderi Tissue Silk Saree','chanderi-tissue-silk-saree',
   'Lightweight Chanderi tissue silk with delicate silver zari borders and traditional motifs. Perfect for festive occasions.',
   'cat-001',8500,7499,'Chanderi Silk','Festive & Puja',FALSE,TRUE,TRUE),

  ('prod-003',
   'Organza Floral Embroidery Saree','organza-floral-embroidery-saree',
   'Sheer organza saree with hand-embroidered floral motifs and sequin borders. A stunning piece for evening receptions.',
   'cat-002',22000,19999,'Organza','Evening Reception',TRUE,TRUE,FALSE),

  ('prod-004',
   'Banarasi Georgette Saree','banarasi-georgette-saree',
   'Elegant Banarasi georgette with woven floral buttas and broad zari border. Drapes effortlessly for all-day wear.',
   'cat-001',12000,10500,'Banarasi Georgette','Festive & Casual',FALSE,FALSE,TRUE),

  ('prod-005',
   'Gota Patti Lehenga Choli Set','gota-patti-lehenga-choli-set',
   'Luxe 3-piece lehenga choli set in raw silk with intricate Gota Patti handwork. A statement ensemble for bridal festivities.',
   'cat-004',28000,25000,'Raw Banarasi Silk','Bridal & Sangeet',TRUE,TRUE,TRUE),

  ('prod-006',
   'Anarkali Hand-Embroidered Gown','anarkali-hand-embroidered-gown',
   'Floor-length Anarkali gown in pure georgette with thread and mirror embroidery on the bodice.',
   'cat-004',15500,14500,'Pure Georgette','Evening Soiree',TRUE,FALSE,TRUE),

  ('prod-007',
   'Kanjivaram Silk Saree','kanjivaram-silk-saree',
   'Authentic Kanjivaram pure mulberry silk with traditional temple border and zari pallu. A heirloom piece to cherish.',
   'cat-002',32000,29999,'Kanjivaram Silk','Bridal & Weddings',FALSE,TRUE,FALSE),

  ('prod-008',
   'Cotton Block Print Dress Material','cotton-block-print-dress-material',
   'Hand block-printed Jaipur cotton dress material in earthy tones. Includes 2.5 m fabric and matching dupatta.',
   'cat-003',2800,2499,'Pure Cotton','Casual & Ethnic',FALSE,FALSE,TRUE),

  ('prod-009',
   'Pashmina Embroidered Salwar Suit','pashmina-embroidered-salwar-suit',
   'Premium Kashmiri Pashmina salwar suit with hand-embroidered aari work. Comes with matching Pashmina dupatta.',
   'cat-003',18000,16500,'Kashmiri Pashmina','Festive & Winter',TRUE,TRUE,FALSE),

  ('prod-010',
   'Festive Silk Kurta Set','festive-silk-kurta-set',
   'Rich chanderi silk kurta with palazzo pants and sheer organza dupatta. Ideal for Diwali and festive gatherings.',
   'cat-005',6500,5999,'Chanderi Silk','Festive & Diwali',FALSE,FALSE,TRUE),

  ('prod-011',
   'Bridal Lehenga Couture','bridal-lehenga-couture',
   'Bespoke bridal lehenga in heavy Banarasi brocade with zardozi and stone work. Fully customizable to your dream design.',
   'cat-006',85000,NULL,'Banarasi Brocade','Bridal Wedding',TRUE,TRUE,FALSE),

  ('prod-012',
   'Mysore Silk Saree','mysore-silk-saree',
   'Authentic Mysore Crepe Silk with woven golden border and rich pallu. A regal choice for South Indian ceremonies.',
   'cat-001',9500,8999,'Mysore Crepe Silk','Ceremony & Puja',FALSE,FALSE,TRUE)
ON CONFLICT ("slug") DO NOTHING;

-- ── Product Images ───────────────────────────────────────────────
INSERT INTO "ProductImage" ("id","productId","imageUrl","altText","isPrimary","sortOrder") VALUES
  ('img-001','prod-001','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80','Varanasi Brocade Silk Saree',TRUE,1),
  ('img-002','prod-001','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80','Varanasi Brocade Silk Saree 2',FALSE,2),
  ('img-003','prod-002','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80','Chanderi Tissue Silk Saree',TRUE,1),
  ('img-004','prod-003','https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80','Organza Floral Embroidery Saree',TRUE,1),
  ('img-005','prod-004','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80','Banarasi Georgette Saree',TRUE,1),
  ('img-006','prod-005','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80','Gota Patti Lehenga Choli Set',TRUE,1),
  ('img-007','prod-006','https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80','Anarkali Hand-Embroidered Gown',TRUE,1),
  ('img-008','prod-007','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80','Kanjivaram Silk Saree',TRUE,1),
  ('img-009','prod-008','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80','Cotton Block Print Dress Material',TRUE,1),
  ('img-010','prod-009','https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80','Pashmina Embroidered Salwar Suit',TRUE,1),
  ('img-011','prod-010','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80','Festive Silk Kurta Set',TRUE,1),
  ('img-012','prod-011','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80','Bridal Lehenga Couture',TRUE,1),
  ('img-013','prod-012','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80','Mysore Silk Saree',TRUE,1)
ON CONFLICT DO NOTHING;

-- ── Product Variants ─────────────────────────────────────────────
INSERT INTO "ProductVariant" ("id","productId","size","color","stockQty","sku","additionalPrice") VALUES
  ('var-001','prod-001','Free Size','Crimson Red',10,'SR-VAR-RED',0),
  ('var-002','prod-001','Free Size','Royal Blue',8,'SR-VAR-BLU',0),
  ('var-003','prod-002','Free Size','Ivory White',15,'SR-CHA-IVR',0),
  ('var-004','prod-002','Free Size','Mint Green',12,'SR-CHA-GRN',0),
  ('var-005','prod-003','Free Size','Blush Pink',6,'SR-ORG-PNK',0),
  ('var-006','prod-003','Free Size','Champagne Gold',5,'SR-ORG-GLD',2000),
  ('var-007','prod-004','Free Size','Maroon',20,'SR-BAN-MAR',0),
  ('var-008','prod-004','Free Size','Teal Green',18,'SR-BAN-TEL',0),
  ('var-009','prod-005','S','Bridal Red',4,'LH-GTP-RED-S',0),
  ('var-010','prod-005','M','Bridal Red',5,'LH-GTP-RED-M',0),
  ('var-011','prod-005','L','Bridal Red',3,'LH-GTP-RED-L',0),
  ('var-012','prod-005','XL','Bridal Red',2,'LH-GTP-RED-XL',1000),
  ('var-013','prod-006','S','Blush Pink',6,'DN-ANK-PNK-S',0),
  ('var-014','prod-006','M','Blush Pink',8,'DN-ANK-PNK-M',0),
  ('var-015','prod-006','L','Midnight Blue',5,'DN-ANK-BLU-L',500),
  ('var-016','prod-007','Free Size','Temple Gold',7,'SR-KNJ-GLD',0),
  ('var-017','prod-007','Free Size','Ruby Red',6,'SR-KNJ-RED',0),
  ('var-018','prod-008','2.5 Metres','Earthy Orange',25,'DM-COT-ORG',0),
  ('var-019','prod-008','2.5 Metres','Indigo Blue',22,'DM-COT-IND',0),
  ('var-020','prod-009','S','Ivory Cream',5,'SS-PAS-IVR-S',0),
  ('var-021','prod-009','M','Ivory Cream',6,'SS-PAS-IVR-M',0),
  ('var-022','prod-009','L','Sage Green',4,'SS-PAS-GRN-L',1500),
  ('var-023','prod-010','S','Saffron Yellow',10,'KS-SLK-YLW-S',0),
  ('var-024','prod-010','M','Saffron Yellow',15,'KS-SLK-YLW-M',0),
  ('var-025','prod-010','L','Peacock Blue',8,'KS-SLK-BLU-L',0),
  ('var-026','prod-011','Custom','Bridal Crimson',3,'BL-COU-CRM-CUS',0),
  ('var-027','prod-012','Free Size','Golden Yellow',12,'SR-MYS-YLW',0),
  ('var-028','prod-012','Free Size','Purple Violet',10,'SR-MYS-PUR',0)
ON CONFLICT ("sku") DO NOTHING;

-- ── Coupons ──────────────────────────────────────────────────────
INSERT INTO "Coupon" ("id","code","discountType","discountValue","minOrderAmount","maxUses","expiresAt") VALUES
  ('cpn-001','AARU10',    'PERCENTAGE', 10, 5000,  500,  '2027-12-31 23:59:59+00'),
  ('cpn-002','WELCOME200','FIXED',     200, 2000,  1000, '2027-12-31 23:59:59+00'),
  ('cpn-003','BRIDAL15',  'PERCENTAGE', 15, 20000, 100,  '2027-12-31 23:59:59+00'),
  ('cpn-004','FESTIVE5',  'PERCENTAGE',  5, 1000,  200,  '2027-12-31 23:59:59+00')
ON CONFLICT ("code") DO NOTHING;



--   ALL DONE!
--  ✅ 17 tables created
--  ✅ 1 admin user  → admin@aaru.com / Admin@123
--  ✅ 6 categories  → Sarees, Designer, Dress Materials, etc.
--  ✅ 12 products   → Varanasi Brocade, Kanjivaram, Lehenga…
--  ✅ 28 variants   → Sizes, colors & stock quantities
--  ✅ 13 images     → Product gallery images (Unsplash)
--  ✅ 4 coupons     → AARU10 · WELCOME200 · BRIDAL15 · FESTIVE5


