/*
  Warnings:

  - You are about to drop the column `priceRange` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Vendor` table. All the data in the column will be lost.
  - The `services` column on the `Vendor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VendorCategory" AS ENUM ('INDIVIDUAL', 'AGENCY', 'VENUE_PROVIDER', 'CATERING', 'CREATIVE', 'RENTAL', 'PROFESSIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('RECREATION_CENTER', 'VENUE_HOSTING', 'CATERING', 'EVENT_PLANNING', 'PHOTOGRAPHY', 'VIDEOSGRAPHY', 'GRAPHIC_DESIGN', 'BRANDING', 'CONTENT_CREATION', 'DECOR_AND_THEMING', 'EQUIPMENT_RENTAL', 'TRANSPORTATION', 'STAFFING', 'HAIR_MAKEUP', 'WARDROBE_STYLING', 'ENTERTAINMENT', 'AV_PRODUCTION', 'LIGHTING_SOUND', 'LIVE_STREAMING', 'DESTINATION_MANAGEMENT', 'SUSTAINABILITY_SERVICES');

-- DropIndex
DROP INDEX "Vendor_priceRange_idx";

-- DropIndex
DROP INDEX "Vendor_type_idx";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "fee" DOUBLE PRECISION,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "priceRange",
DROP COLUMN "type",
ADD COLUMN     "category" "VendorCategory" NOT NULL,
ADD COLUMN     "customServices" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logoUrl" TEXT,
DROP COLUMN "services",
ADD COLUMN     "services" "ServiceType"[];

-- DropEnum
DROP TYPE "VendorType";

-- CreateTable
CREATE TABLE "VendorTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VendorTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VendorTiers" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VendorTiers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorTier_name_key" ON "VendorTier"("name");

-- CreateIndex
CREATE INDEX "_VendorTiers_B_index" ON "_VendorTiers"("B");

-- CreateIndex
CREATE INDEX "Vendor_category_idx" ON "Vendor"("category");

-- AddForeignKey
ALTER TABLE "_VendorTiers" ADD CONSTRAINT "_VendorTiers_A_fkey" FOREIGN KEY ("A") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VendorTiers" ADD CONSTRAINT "_VendorTiers_B_fkey" FOREIGN KEY ("B") REFERENCES "VendorTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
