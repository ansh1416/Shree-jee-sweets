-- ============================================================
-- Shree Jee Sweets POS — Turso Database Setup
-- ============================================================
-- Paste ALL of this into the Turso Shell to create your tables.
-- Steps:
--   1. Go to turso.tech → your database → "Shell" tab
--   2. Paste this entire file and press Enter
-- ============================================================

CREATE TABLE IF NOT EXISTS "User" (
  "id"       TEXT PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role"     TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id"            TEXT PRIMARY KEY,
  "name"          TEXT NOT NULL,
  "pricePerKg"    REAL,
  "pricePerPiece" REAL,
  "pricePerBowl"  REAL,
  "costPrice"     REAL NOT NULL,
  "category"      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Sale" (
  "id"          TEXT PRIMARY KEY,
  "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "totalAmount" REAL NOT NULL,
  "totalProfit" REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS "SaleItem" (
  "id"        TEXT PRIMARY KEY,
  "saleId"    TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity"  REAL NOT NULL,
  "amount"    REAL NOT NULL,
  "profit"    REAL NOT NULL,
  FOREIGN KEY ("saleId")    REFERENCES "Sale"("id")    ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Inventory" (
  "id"           TEXT PRIMARY KEY,
  "productId"    TEXT NOT NULL,
  "date"         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "morningStock" REAL NOT NULL,
  "currentStock" REAL NOT NULL,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- ============================================================
-- Useful indexes for query performance
-- ============================================================
CREATE INDEX IF NOT EXISTS "Sale_createdAt_idx"    ON "Sale"("createdAt");
CREATE INDEX IF NOT EXISTS "SaleItem_saleId_idx"   ON "SaleItem"("saleId");
CREATE INDEX IF NOT EXISTS "SaleItem_productId_idx" ON "SaleItem"("productId");
CREATE INDEX IF NOT EXISTS "Inventory_productId_date_idx" ON "Inventory"("productId", "date");

-- ============================================================
-- Done! After this, go back to your PC and run:
--   npx tsx prisma/seed.ts
-- with DATABASE_URL pointing to your Turso database to create users.
-- ============================================================
