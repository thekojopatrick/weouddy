import { EventFormValues } from "@/types/validation";
import { generateQRCode } from "@/lib/qr/generator";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { storeQRCode } from "@/lib/qr/storage";
import { uploadEventCoverImage } from "@/lib/supabase/upload/event-cover-image";

export async function createEventAction(data: EventFormValues, userId: string) {
  if (!data || !userId) {
    throw new Error("Missing required data for event creation");
  }

  // First, check for recent events outside the transaction
  const recentEvent = await prisma.event.findFirst({
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

  // Process cover image outside transaction if it exists
  let coverImageUrl = null;
  if (data.coverImage) {
    try {
      const imageSize = Buffer.from(
        data.coverImage.split(",")[1],
        "base64",
      ).length;
      if (imageSize > 5 * 1024 * 1024) {
        throw new Error("Cover image exceeds maximum size of 5MB");
      }
      coverImageUrl = await uploadEventCoverImage(data.coverImage, nanoid(8));
    } catch (error) {
      console.error("Cover image upload error:", error);
      throw new Error(
        `Failed to upload cover image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  // Generate QR code outside transaction
  const shortSlug = nanoid(8);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const eventUrl = `${baseUrl}/events/${shortSlug}`;
  let qrCode;
  try {
    qrCode = await generateQRCode(eventUrl);
    if (!qrCode || !qrCode.dataUrl) {
      throw new Error("Failed to generate QR code");
    }
  } catch (error) {
    console.error("QR code generation error:", error);
    throw new Error("Failed to generate QR code");
  }

  // Create the event in a transaction
  try {
    const [hours, minutes] = data.time.split(":");
    const dateTime = new Date(data.date);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const event = await prisma.event.create({
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

    // Store QR code after event creation
    let publicUrl;
    try {
      publicUrl = await storeQRCode(event.id, qrCode);
    } catch (error) {
      console.error("QR code storage error:", error);
      // Continue without QR code if storage fails
      publicUrl = null;
    }

    // Update event with QR code URL in a separate operation
    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: { qrCodeUrl: publicUrl },
      include: {
        host: true,
      },
    });

    // Create activity log
    await prisma.eventActivity.create({
      data: {
        eventId: event.id,
        userId,
        type: "JOIN",
      },
    });

    return {
      ...updatedEvent,
      qrCodeUrl: publicUrl,
      qrCode: publicUrl
        ? {
            ...qrCode,
            publicUrl,
          }
        : null,
    };
  } catch (error) {
    console.error("Event creation error:", error);
    throw new Error(
      `Failed to create event: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}
