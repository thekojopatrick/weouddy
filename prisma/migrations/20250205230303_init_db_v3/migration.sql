-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'VENDOR', 'PARTNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "EventActivityType" AS ENUM ('JOIN', 'LEAVE', 'POST', 'LIKE', 'COMMENT', 'DELETE', 'REPORT', 'RESQUEST_PENDING', 'ACCESS_DENIED', 'ACCESS_GRANTED');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('DIRECT_PASS', 'PIN_REQUIRED', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('APPROVED', 'UNSUBSCRIBED', 'AUTO_ARCHIVED');

-- CreateEnum
CREATE TYPE "FormsType" AS ENUM ('CONTACT', 'NEWSLETTER');

-- CreateEnum
CREATE TYPE "AttendeeStatus" AS ENUM ('JOINED', 'PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('ACCOUNT_SETUP', 'EVENT_EXPERIENCE', 'APP_USABILITY', 'BUG_REPORT', 'FEATURE_REQUEST', 'OTHER');

-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('UI_UX', 'PERFORMANCE', 'FUNCTIONALITY', 'CONTENT', 'TECHNICAL', 'GENERAL', 'SUGGESTION');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('USER', 'VENDOR_TEAM', 'EVENT_TEAM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT_REMINDER', 'EVENT_UPDATE', 'POST_LIKE', 'POST_COMMENT', 'NEW_FOLLOWER', 'MESSAGE', 'SYSTEM', 'BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'PAYMENT_RECEIVED', 'REVIEW_RECEIVED', 'VENDOR_INVITATION', 'VENDOR_ACCOUNT_UPDATE', 'VENDOR_PERFORMANCE_METRICS', 'VENDOR_PROMOTION');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('VENUE', 'CATERER', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'ENTERTAINMENT', 'DECOR', 'TRANSPORTATION', 'PLANNER', 'STYLIST', 'RENTAL', 'CORPORATE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('USER', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "PriceRange" AS ENUM ('BUDGET', 'MIDRANGE', 'LUXURY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TravelScope" AS ENUM ('LOCAL_ONLY', 'NATIONAL', 'INTERNATIONAL', 'NATIONAL_AND_INTERNATIONAL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('INQUIRY', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'CONTACTED', 'BOOKED', 'DECLINED');

-- CreateEnum
CREATE TYPE "AnalyticsType" AS ENUM ('VENDOR', 'EVENT', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "dob" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "allowFollowers" BOOLEAN NOT NULL DEFAULT true,
    "isPrivateProfile" BOOLEAN NOT NULL DEFAULT false,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "qrCodeUrl" TEXT,
    "coverImage" TEXT,
    "slug" TEXT,
    "pinCode" TEXT,
    "vendorBudget" DOUBLE PRECISION,
    "vendorCosts" JSONB,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "allowLikes" BOOLEAN NOT NULL DEFAULT true,
    "allowChat" BOOLEAN NOT NULL DEFAULT false,
    "allowPosts" BOOLEAN NOT NULL DEFAULT true,
    "accessType" "AccessType" NOT NULL DEFAULT 'DIRECT_PASS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hostId" UUID NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "status" "AttendeeStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTeam" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "eventId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTeamMember" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "eventTeamId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventActivity" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "EventActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "vendorId" UUID,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSettings" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "eventId" UUID NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "allowGuestMessages" BOOLEAN NOT NULL DEFAULT true,
    "slowMode" BOOLEAN NOT NULL DEFAULT false,
    "slowModeInterval" INTEGER NOT NULL DEFAULT 0,
    "requireModeration" BOOLEAN NOT NULL DEFAULT false,
    "muteList" JSONB,
    "banList" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostMedia" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "postId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowRequest" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "requestorId" UUID NOT NULL,
    "targetUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "userId" UUID NOT NULL,
    "eventId" UUID,
    "postId" UUID,
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
CREATE TABLE "Vendor" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VendorType" NOT NULL,
    "services" TEXT[],
    "priceRange" "PriceRange" NOT NULL,
    "location" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "aiTags" TEXT[],
    "aiMetadata" JSONB,
    "contactEmail" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "travelScope" "TravelScope" NOT NULL DEFAULT 'LOCAL_ONLY',
    "travelFee" DOUBLE PRECISION,
    "servingCities" TEXT[],
    "travelNotes" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOperations" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
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
CREATE TABLE "VendorAttribute" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "VendorAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPackage" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "inclusions" TEXT[],
    "basePrice" DOUBLE PRECISION NOT NULL,
    "surgePrice" DOUBLE PRECISION,
    "discountRules" JSONB,

    CONSTRAINT "VendorPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVendor" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "eventId" UUID NOT NULL,
    "vendorId" UUID NOT NULL,
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,

    CONSTRAINT "EventVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "vendorId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "packageId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorReview" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" UUID NOT NULL,
    "vendorId" UUID NOT NULL,
    "bookingId" UUID,

    CONSTRAINT "VendorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPageVisit" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "userId" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorPageVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTeam" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VendorTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTeamMember" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorTeamId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorContact" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
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
    "groupId" UUID,

    CONSTRAINT "VendorContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactGroup" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "InvitationType" NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "inviterId" UUID NOT NULL,
    "inviteeId" UUID,
    "inviteeEmail" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "AnalyticsType" NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB,
    "vendorId" UUID,
    "eventId" UUID,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forms" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "type" "FormsType" NOT NULL DEFAULT 'CONTACT',
    "status" "NewsletterStatus",
    "userId" TEXT,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "rating" INTEGER NOT NULL,
    "message" TEXT,
    "category" "FeedbackCategory" NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Event_publicId_key" ON "Event"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_pinCode_key" ON "Event"("pinCode");

-- CreateIndex
CREATE INDEX "Event_hostId_idx" ON "Event"("hostId");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "Event_isDisabled_isPrivate_location_type_idx" ON "Event"("isDisabled", "isPrivate", "location", "type");

-- CreateIndex
CREATE INDEX "Event_hostId_createdAt_idx" ON "Event"("hostId", "createdAt");

-- CreateIndex
CREATE INDEX "Event_isDisabled_createdAt_idx" ON "Event"("isDisabled", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_publicId_key" ON "Attendee"("publicId");

-- CreateIndex
CREATE INDEX "Attendee_eventId_userId_idx" ON "Attendee"("eventId", "userId");

-- CreateIndex
CREATE INDEX "Attendee_userId_status_idx" ON "Attendee"("userId", "status");

-- CreateIndex
CREATE INDEX "Attendee_eventId_status_idx" ON "Attendee"("eventId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_userId_eventId_key" ON "Attendee"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTeam_publicId_key" ON "EventTeam"("publicId");

-- CreateIndex
CREATE INDEX "EventTeam_eventId_idx" ON "EventTeam"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTeamMember_publicId_key" ON "EventTeamMember"("publicId");

-- CreateIndex
CREATE INDEX "EventTeamMember_eventTeamId_idx" ON "EventTeamMember"("eventTeamId");

-- CreateIndex
CREATE INDEX "EventTeamMember_userId_idx" ON "EventTeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTeamMember_eventTeamId_userId_key" ON "EventTeamMember"("eventTeamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventActivity_publicId_key" ON "EventActivity"("publicId");

-- CreateIndex
CREATE INDEX "EventActivity_createdAt_idx" ON "EventActivity"("createdAt");

-- CreateIndex
CREATE INDEX "EventActivity_eventId_idx" ON "EventActivity"("eventId");

-- CreateIndex
CREATE INDEX "EventActivity_userId_idx" ON "EventActivity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_publicId_key" ON "Message"("publicId");

-- CreateIndex
CREATE INDEX "Message_eventId_idx" ON "Message"("eventId");

-- CreateIndex
CREATE INDEX "Message_userId_idx" ON "Message"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_publicId_key" ON "MessageReaction"("publicId");

-- CreateIndex
CREATE INDEX "MessageReaction_messageId_idx" ON "MessageReaction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_emoji_key" ON "MessageReaction"("messageId", "userId", "emoji");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSettings_publicId_key" ON "ChatSettings"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSettings_eventId_key" ON "ChatSettings"("eventId");

-- CreateIndex
CREATE INDEX "ChatSettings_eventId_idx" ON "ChatSettings"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_publicId_key" ON "Post"("publicId");

-- CreateIndex
CREATE INDEX "Post_eventId_idx" ON "Post"("eventId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostMedia_publicId_key" ON "PostMedia"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_publicId_key" ON "Comment"("publicId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_publicId_key" ON "Like"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_publicId_key" ON "Follow"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRequest_publicId_key" ON "FollowRequest"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRequest_requestorId_targetUserId_key" ON "FollowRequest"("requestorId", "targetUserId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_eventId_idx" ON "Notification"("eventId");

-- CreateIndex
CREATE INDEX "Notification_postId_idx" ON "Notification"("postId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_publicId_key" ON "Vendor"("publicId");

-- CreateIndex
CREATE INDEX "Vendor_type_idx" ON "Vendor"("type");

-- CreateIndex
CREATE INDEX "Vendor_location_idx" ON "Vendor"("location");

-- CreateIndex
CREATE INDEX "Vendor_priceRange_idx" ON "Vendor"("priceRange");

-- CreateIndex
CREATE INDEX "Vendor_rating_idx" ON "Vendor"("rating");

-- CreateIndex
CREATE INDEX "Vendor_userId_idx" ON "Vendor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOperations_publicId_key" ON "VendorOperations"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOperations_vendorId_key" ON "VendorOperations"("vendorId");

-- CreateIndex
CREATE INDEX "VendorOperations_vendorId_idx" ON "VendorOperations"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorAttribute_publicId_key" ON "VendorAttribute"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorAttribute_vendorId_key_key" ON "VendorAttribute"("vendorId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "VendorPackage_publicId_key" ON "VendorPackage"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "EventVendor_publicId_key" ON "EventVendor"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "EventVendor_eventId_vendorId_key" ON "EventVendor"("eventId", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_publicId_key" ON "Booking"("publicId");

-- CreateIndex
CREATE INDEX "Booking_vendorId_idx" ON "Booking"("vendorId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_date_idx" ON "Booking"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VendorReview_publicId_key" ON "VendorReview"("publicId");

-- CreateIndex
CREATE INDEX "VendorReview_vendorId_idx" ON "VendorReview"("vendorId");

-- CreateIndex
CREATE INDEX "VendorReview_userId_idx" ON "VendorReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorPageVisit_publicId_key" ON "VendorPageVisit"("publicId");

-- CreateIndex
CREATE INDEX "IX_VendorPageVisit_vendorId" ON "VendorPageVisit"("vendorId");

-- CreateIndex
CREATE INDEX "IX_VendorPageVisit_userId" ON "VendorPageVisit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorTeam_publicId_key" ON "VendorTeam"("publicId");

-- CreateIndex
CREATE INDEX "VendorTeam_vendorId_idx" ON "VendorTeam"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorTeamMember_publicId_key" ON "VendorTeamMember"("publicId");

-- CreateIndex
CREATE INDEX "VendorTeamMember_vendorTeamId_idx" ON "VendorTeamMember"("vendorTeamId");

-- CreateIndex
CREATE INDEX "VendorTeamMember_userId_idx" ON "VendorTeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorTeamMember_vendorTeamId_userId_key" ON "VendorTeamMember"("vendorTeamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorContact_publicId_key" ON "VendorContact"("publicId");

-- CreateIndex
CREATE INDEX "VendorContact_vendorId_idx" ON "VendorContact"("vendorId");

-- CreateIndex
CREATE INDEX "VendorContact_userId_idx" ON "VendorContact"("userId");

-- CreateIndex
CREATE INDEX "VendorContact_email_idx" ON "VendorContact"("email");

-- CreateIndex
CREATE INDEX "VendorContact_contactType_idx" ON "VendorContact"("contactType");

-- CreateIndex
CREATE UNIQUE INDEX "ContactGroup_publicId_key" ON "ContactGroup"("publicId");

-- CreateIndex
CREATE INDEX "ContactGroup_vendorId_idx" ON "ContactGroup"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_publicId_key" ON "Invitation"("publicId");

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
CREATE UNIQUE INDEX "Analytics_publicId_key" ON "Analytics"("publicId");

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

-- CreateIndex
CREATE UNIQUE INDEX "Forms_publicId_key" ON "Forms"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Forms_email_userId_key" ON "Forms"("email", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_publicId_key" ON "Feedback"("publicId");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_type_idx" ON "Feedback"("type");

-- CreateIndex
CREATE INDEX "Feedback_category_idx" ON "Feedback"("category");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "Feedback"("status");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeam" ADD CONSTRAINT "EventTeam_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeamMember" ADD CONSTRAINT "EventTeamMember_eventTeamId_fkey" FOREIGN KEY ("eventTeamId") REFERENCES "EventTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeamMember" ADD CONSTRAINT "EventTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventActivity" ADD CONSTRAINT "EventActivity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventActivity" ADD CONSTRAINT "EventActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSettings" ADD CONSTRAINT "ChatSettings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOperations" ADD CONSTRAINT "VendorOperations_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttribute" ADD CONSTRAINT "VendorAttribute_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPackage" ADD CONSTRAINT "VendorPackage_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVendor" ADD CONSTRAINT "EventVendor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVendor" ADD CONSTRAINT "EventVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "VendorPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReview" ADD CONSTRAINT "VendorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReview" ADD CONSTRAINT "VendorReview_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReview" ADD CONSTRAINT "VendorReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
