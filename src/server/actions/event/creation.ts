import { EventFormValues } from "@/types/validation";
import { generateQRCode } from "@/lib/qr/generator";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { storeQRCode } from "@/lib/qr/storage";
import { uploadEventCoverImage } from "@/lib/supabase/upload/event-cover-image";
const MAX_COVER_IMAGE_SIZE = 800 * 1024;

export async function createEventAction(data: EventFormValues, userId: string) {
  if (!data || !userId) {
    throw new Error("Missing required data for event creation");
  }

  return await prisma.$transaction(async (tx) => {
    try {
      // Check for recent events
      const recentEvent = await tx.event.findFirst({
        where: {
          hostId: userId,
          createdAt: {
            gte: new Date(Date.now() - 30000),
          },
        },
      });

      if (recentEvent) {
        throw new Error("Please wait a moment before creating another event");
      }

      const [hours, minutes] = data.time.split(":");
      const dateTime = new Date(data.date);
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      const shortSlug = nanoid(8);

      // Handle cover image
      let coverImageUrl = null;
      if (data.coverImage) {
        try {
          const imageSize = Buffer.from(
            data.coverImage.split(",")[1],
            "base64",
          ).length;
          if (imageSize > MAX_COVER_IMAGE_SIZE) {
            throw new Error("Cover image exceeds maximum size of 800KB");
          }
          coverImageUrl = await uploadEventCoverImage(
            data.coverImage,
            shortSlug,
          );
        } catch (error) {
          console.error("Cover image upload error:", error);
          throw new Error(
            `Failed to upload cover image: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          );
        }
      }

      // Create event
      const event = await tx.event.create({
        data: {
          name: data.title,
          description: data.description,
          type: data.type,
          location: data.location,
          dateTime: dateTime,
          coverImage: coverImageUrl,
          isPrivate: !data.isPublic,
          hostId: userId,
          slug: shortSlug,
        },
        include: {
          host: true,
        },
      });

      // Generate QR code
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

      const eventUrl = `${baseUrl}/events/${event.slug}`;
      const qrCode = await generateQRCode(eventUrl);

      if (!qrCode || !qrCode.dataUrl) {
        throw new Error("Failed to generate QR code");
      }

      // Store QR code with additional error handling
      const publicUrl = await storeQRCode(event.id, qrCode);

      if (!publicUrl) {
        throw new Error("Failed to get public URL for QR code");
      }

      // Update event with QR code URL
      const updatedEvent = await tx.event.update({
        where: { id: event.id },
        data: { qrCodeUrl: publicUrl },
        include: {
          host: true,
        },
      });

      // Create activity log
      await tx.eventActivity.create({
        data: {
          eventId: event.id,
          userId,
          type: "JOIN",
        },
      });

      return {
        ...updatedEvent,
        qrCodeUrl: publicUrl,
        qrCode: {
          ...qrCode,
          publicUrl,
        },
      };
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  });
}
