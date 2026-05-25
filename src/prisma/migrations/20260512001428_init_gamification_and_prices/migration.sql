-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARN', 'SPEND', 'BONUS');

-- AlterTable
ALTER TABLE "PriceEntry" ADD COLUMN     "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalXp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PointsLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "receiptId" TEXT,
    "actionType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PointsLog_userId_idx" ON "PointsLog"("userId");

-- CreateIndex
CREATE INDEX "PriceEntry_issueDate_idx" ON "PriceEntry"("issueDate");

-- AddForeignKey
ALTER TABLE "PointsLog" ADD CONSTRAINT "PointsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
