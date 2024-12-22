import { EventFormValues } from "@/types/validation";
import { generateQRCode } from "@/lib/qr/generator";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { storeQRCode } from "@/lib/qr/storage";
import { uploadEventCoverImage } from "@/lib/supabase/upload/event-cover-image";

// First, let's define the proper types for our QR code
interface QRCodeResult {
  dataUrl: string;
  downloadUrl: string;
  fileName: string;
}

interface QRCodeOptions {
  quality?: number;
  size?: number;
}

// Constants for file size limits
const MAX_QR_SIZE = 500 * 1024; // 500KB
const MAX_COVER_IMAGE_SIZE = 800 * 1024; // 800KB

// Helper to compress QR code if needed
async function optimizeQRCode(qrCode: QRCodeResult): Promise<QRCodeResult> {
  const base64Data = qrCode.dataUrl.split(",")[1];
  const sizeInBytes = Buffer.from(base64Data, "base64").length;

  if (sizeInBytes > MAX_QR_SIZE) {
    // Reduce QR code size by adjusting quality or size
    const options: QRCodeOptions = {
      size: 256, // Reduced size
      quality: 0.8, // Reduced quality
    };

    const optimizedQR = await generateQRCode(qrCode.dataUrl, options);
    return {
      ...optimizedQR,
      downloadUrl: qrCode.downloadUrl,
      fileName: qrCode.fileName,
    };
  }
  return qrCode;
}

export async function createEventAction(data: EventFormValues, userId: string) {
  // Add transaction to prevent duplicate events
  return await prisma.$transaction(async (tx) => {
    // Check if an event was recently created by this user (within last 30 seconds)
    const recentEvent = await tx.event.findFirst({
      where: {
        hostId: userId,
        createdAt: {
          gte: new Date(Date.now() - 30000), // 30 seconds ago
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
        // Add size check for cover image
        const imageSize =
          Buffer.from(data.coverImage.split(",")[1], "base64").length;
        if (imageSize > MAX_COVER_IMAGE_SIZE) {
          throw new Error("Cover image exceeds maximum size of 800KB");
        }
        coverImageUrl = await uploadEventCoverImage(data.coverImage, shortSlug);
      } catch (error) {
        console.error("Cover image upload failed:", error);
        throw new Error(
          "Failed to upload cover image: " + (error as Error).message,
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

    // Generate and optimize QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const eventUrl = `${baseUrl}/events/${event.slug}`;
    let qrCode = await generateQRCode(eventUrl) as QRCodeResult;
    qrCode = await optimizeQRCode(qrCode);

    // Store QR code
    try {
      const publicUrl = await storeQRCode(event.id, qrCode);

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
      throw new Error("Failed to store QR code: " + (error as Error).message);
    }
  });
}
