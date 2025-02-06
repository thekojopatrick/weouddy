-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "city" TEXT,
ADD COLUMN     "coordinates" JSONB,
ADD COLUMN     "country" TEXT;
