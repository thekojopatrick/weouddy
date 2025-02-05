/*
  Warnings:

  - Added the required column `basePrice` to the `VendorPackage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TravelScope" AS ENUM ('LOCAL_ONLY', 'NATIONAL', 'INTERNATIONAL', 'NATIONAL_AND_INTERNATIONAL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'VENDOR';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "VendorType" ADD VALUE 'STYLIST';
ALTER TYPE "VendorType" ADD VALUE 'RENTAL';
ALTER TYPE "VendorType" ADD VALUE 'CORPORATE';

-- DropIndex
DROP INDEX "Event_location_type_idx";

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "aiTags" TEXT[],
ADD COLUMN     "servingCities" TEXT[],
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "travelFee" DOUBLE PRECISION,
ADD COLUMN     "travelNotes" TEXT,
ADD COLUMN     "travelScope" "TravelScope" NOT NULL DEFAULT 'LOCAL_ONLY';

-- AlterTable
ALTER TABLE "VendorPackage" ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discountRules" JSONB,
ADD COLUMN     "surgePrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "VendorReview" ADD COLUMN     "bookingId" TEXT;

-- CreateTable
CREATE TABLE "VendorOperations" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "businessHours" JSONB,
    "availability" JSONB,
    "completionRate" DOUBLE PRECISION,
    "responseTime" INTEGER,
    "cancellationRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorOperations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "vendorId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "packageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorOperations_vendorId_key" ON "VendorOperations"("vendorId");

-- CreateIndex
CREATE INDEX "VendorOperations_vendorId_idx" ON "VendorOperations"("vendorId");

-- CreateIndex
CREATE INDEX "Booking_vendorId_idx" ON "Booking"("vendorId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_date_idx" ON "Booking"("date");

-- CreateIndex
CREATE INDEX "Attendee_eventId_status_idx" ON "Attendee"("eventId", "status");

-- CreateIndex
CREATE INDEX "Event_isDisabled_isPrivate_location_type_idx" ON "Event"("isDisabled", "isPrivate", "location", "type");

-- CreateIndex
CREATE INDEX "Event_hostId_createdAt_idx" ON "Event"("hostId", "createdAt");

-- CreateIndex
CREATE INDEX "Event_isDisabled_createdAt_idx" ON "Event"("isDisabled", "createdAt");

-- AddForeignKey
ALTER TABLE "VendorOperations" ADD CONSTRAINT "VendorOperations_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "VendorPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReview" ADD CONSTRAINT "VendorReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
