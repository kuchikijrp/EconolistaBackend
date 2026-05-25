-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'ERROR');

-- CreateTable
CREATE TABLE "Receipts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url_sefaz" TEXT NOT NULL,
    "access_key" TEXT,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Receipts_url_sefaz_key" ON "Receipts"("url_sefaz");

-- AddForeignKey
ALTER TABLE "Receipts" ADD CONSTRAINT "Receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
