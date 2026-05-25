/*
  Warnings:

  - A unique constraint covering the columns `[nfeId,productRawId]` on the table `PriceEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nfeId` to the `PriceEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productRawId` to the `PriceEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PriceEntry" DROP CONSTRAINT "PriceEntry_productId_fkey";

-- AlterTable
ALTER TABLE "PriceEntry" ADD COLUMN     "nfeId" TEXT NOT NULL,
ADD COLUMN     "productRawId" TEXT NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PriceEntry_marketId_productId_idx" ON "PriceEntry"("marketId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceEntry_nfeId_productRawId_key" ON "PriceEntry"("nfeId", "productRawId");

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_productRawId_fkey" FOREIGN KEY ("productRawId") REFERENCES "ProductRaw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
