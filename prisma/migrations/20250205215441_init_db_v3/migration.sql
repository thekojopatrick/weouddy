/*
  Warnings:

  - You are about to drop the `EventRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('USER', 'VENDOR_TEAM', 'EVENT_TEAM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT_REMINDER', 'EVENT_UPDATE', 'POST_LIKE', 'POST_COMMENT', 'NEW_FOLLOWER', 'MESSAGE', 'SYSTEM', 'BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'PAYMENT_RECEIVED', 'REVIEW_RECEIVED', 'VENDOR_INVITATION', 'VENDOR_ACCOUNT_UPDATE', 'VENDOR_PERFORMANCE_METRICS', 'VENDOR_PROMOTION');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('USER', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "AnalyticsType" AS ENUM ('VENDOR', 'EVENT', 'USER');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'INQUIRY';

-- AlterEnum
ALTER TYPE "FeedbackCategory" ADD VALUE 'SUGGESTION';

-- DropForeignKey
ALTER TABLE "EventRole" DROP CONSTRAINT "EventRole_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventRole" DROP CONSTRAINT "EventRole_userId_fkey";

-- DropTable
DROP TABLE "EventRole";

-- CreateTable
CREATE TABLE "EventTeam" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTeamMember" (
    "id" TEXT NOT NULL,
    "eventTeamId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "userId" UUID NOT NULL,
    "eventId" TEXT,
    "postId" TEXT,
    "subject" VARCHAR(128),
    "content" VARCHAR(2000) NOT NULL,
    "link" VARCHAR(500),
    "seenAt" TIMESTAMP(3),
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPageVisit" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "userId" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorPageVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTeam" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VendorTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTeamMember" (
    "id" TEXT NOT NULL,
    "vendorTeamId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorContact" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "contactType" "ContactType" NOT NULL,
    "userId" UUID,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "tags" TEXT[],
    "notes" TEXT,
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT,

    CONSTRAINT "VendorContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactGroup" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "type" "InvitationType" NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT,
    "inviteeEmail" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsType" NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB,
    "vendorId" TEXT,
    "eventId" TEXT,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventTeam_eventId_idx" ON "EventTeam"("eventId");

-- CreateIndex
CREATE INDEX "EventTeamMember_eventTeamId_idx" ON "EventTeamMember"("eventTeamId");

-- CreateIndex
CREATE INDEX "EventTeamMember_userId_idx" ON "EventTeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTeamMember_eventTeamId_userId_key" ON "EventTeamMember"("eventTeamId", "userId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_eventId_idx" ON "Notification"("eventId");

-- CreateIndex
CREATE INDEX "Notification_postId_idx" ON "Notification"("postId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "IX_VendorPageVisit_vendorId" ON "VendorPageVisit"("vendorId");

-- CreateIndex
CREATE INDEX "IX_VendorPageVisit_userId" ON "VendorPageVisit"("userId");

-- CreateIndex
CREATE INDEX "VendorTeam_vendorId_idx" ON "VendorTeam"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTeamMember_vendorTeamId_idx" ON "VendorTeamMember"("vendorTeamId");

-- CreateIndex
CREATE INDEX "VendorTeamMember_userId_idx" ON "VendorTeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorTeamMember_vendorTeamId_userId_key" ON "VendorTeamMember"("vendorTeamId", "userId");

-- CreateIndex
CREATE INDEX "VendorContact_vendorId_idx" ON "VendorContact"("vendorId");

-- CreateIndex
CREATE INDEX "VendorContact_userId_idx" ON "VendorContact"("userId");

-- CreateIndex
CREATE INDEX "VendorContact_email_idx" ON "VendorContact"("email");

-- CreateIndex
CREATE INDEX "VendorContact_contactType_idx" ON "VendorContact"("contactType");

-- CreateIndex
CREATE INDEX "ContactGroup_vendorId_idx" ON "ContactGroup"("vendorId");

-- CreateIndex
CREATE INDEX "Invitation_inviterId_idx" ON "Invitation"("inviterId");

-- CreateIndex
CREATE INDEX "Invitation_inviteeId_idx" ON "Invitation"("inviteeId");

-- CreateIndex
CREATE INDEX "Invitation_inviteeEmail_idx" ON "Invitation"("inviteeEmail");

-- CreateIndex
CREATE INDEX "Invitation_type_idx" ON "Invitation"("type");

-- CreateIndex
CREATE INDEX "Invitation_status_idx" ON "Invitation"("status");

-- CreateIndex
CREATE INDEX "Analytics_type_idx" ON "Analytics"("type");

-- CreateIndex
CREATE INDEX "Analytics_metric_idx" ON "Analytics"("metric");

-- CreateIndex
CREATE INDEX "Analytics_vendorId_idx" ON "Analytics"("vendorId");

-- CreateIndex
CREATE INDEX "Analytics_eventId_idx" ON "Analytics"("eventId");

-- CreateIndex
CREATE INDEX "Analytics_userId_idx" ON "Analytics"("userId");

-- CreateIndex
CREATE INDEX "Analytics_createdAt_idx" ON "Analytics"("createdAt");

-- AddForeignKey
ALTER TABLE "EventTeam" ADD CONSTRAINT "EventTeam_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeamMember" ADD CONSTRAINT "EventTeamMember_eventTeamId_fkey" FOREIGN KEY ("eventTeamId") REFERENCES "EventTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeamMember" ADD CONSTRAINT "EventTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPageVisit" ADD CONSTRAINT "VendorPageVisit_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPageVisit" ADD CONSTRAINT "VendorPageVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTeam" ADD CONSTRAINT "VendorTeam_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTeamMember" ADD CONSTRAINT "VendorTeamMember_vendorTeamId_fkey" FOREIGN KEY ("vendorTeamId") REFERENCES "VendorTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTeamMember" ADD CONSTRAINT "VendorTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ContactGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactGroup" ADD CONSTRAINT "ContactGroup_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterUser_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterVendor_fkey" FOREIGN KEY ("inviterId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterEvent_fkey" FOREIGN KEY ("inviterId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
