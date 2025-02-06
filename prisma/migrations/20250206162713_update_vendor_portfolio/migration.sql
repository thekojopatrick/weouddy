/*
  Warnings:

  - You are about to drop the column `media` on the `PortfolioItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "media",
ADD COLUMN     "eventId" UUID;

-- AlterTable
ALTER TABLE "PostMedia" ADD COLUMN     "portfolioItemId" UUID;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_portfolioItemId_fkey" FOREIGN KEY ("portfolioItemId") REFERENCES "PortfolioItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
