/*
  Warnings:

  - You are about to drop the column `nfeId` on the `PriceEntry` table. All the data in the column will be lost.
  - Added the required column `receiptId` to the `PriceEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PriceEntry_marketId_productId_idx";

-- DropIndex
DROP INDEX "PriceEntry_nfeId_productRawId_key";

-- AlterTable
ALTER TABLE "PriceEntry" DROP COLUMN "nfeId",
ADD COLUMN     "receiptId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PriceEntry_receiptId_idx" ON "PriceEntry"("receiptId");

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
