-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "ean" TEXT,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "unit" TEXT,
    "category" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductRaw" (
    "id" TEXT NOT NULL,
    "rawName" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "ProductRaw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceEntry" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "marketId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nfeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_cnpj_key" ON "Market"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Product_ean_key" ON "Product"("ean");

-- CreateIndex
CREATE UNIQUE INDEX "ProductRaw_rawName_key" ON "ProductRaw"("rawName");

-- CreateIndex
CREATE INDEX "PriceEntry_productId_marketId_idx" ON "PriceEntry"("productId", "marketId");

-- AddForeignKey
ALTER TABLE "ProductRaw" ADD CONSTRAINT "ProductRaw_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
