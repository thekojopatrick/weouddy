import { EventFormValues } from "@/types/validation";
import { generateQRCode } from "@/lib/qr/generator";
import { nanoid } from "nanoid"; // Add nanoid for shorter unique identifiers
import { prisma } from "@/lib/prisma";
import { storeQRCode } from "@/lib/qr/storage";
import { uploadEventCoverImage } from "@/lib/supabase/upload/event-cover-image"; // New import

export async function createEventAction(data: EventFormValues, userId: string) {
  const [hours, minutes] = data.time.split(":");
  const dateTime = new Date(data.date);
  dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

  // Generate a shorter, generic slug
  const shortSlug = nanoid(8); // 8-character unique identifier

  // Upload cover image to Supabase if present
  let coverImageUrl = null;
  if (data.coverImage) {
    try {
      coverImageUrl = await uploadEventCoverImage(
        data.coverImage,
        shortSlug, // Use the shortSlug as part of the image identification
      );
    } catch (error) {
      console.error("Cover image upload failed:", error);
      // Optionally, you could choose to not block event creation if image upload fails
    }
  }

  // Create event with initial settings
  const event = await prisma.event.create({
    data: {
      name: data.title,
      description: data.description,
      type: data.type,
      location: data.location,
      dateTime: dateTime,
      coverImage: coverImageUrl, // Use Supabase URL
      isPrivate: !data.isPublic, // Note the negation
      hostId: userId,
      slug: shortSlug, // Use the shorter slug
    },
    include: {
      host: true,
    },
  });

  // Generate and store QR code
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const eventUrl = `${baseUrl}/events/${event.slug}`;
  const qrCode = await generateQRCode(eventUrl);
  const publicUrl = await storeQRCode(event.id, qrCode);

  // Update event with QR code URL
  const updatedEvent = await prisma.event.update({
    where: { id: event.id },
    data: { qrCodeUrl: publicUrl },
    include: {
      host: true,
    },
  });

  // Track event creation activity
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
    qrCode: {
      ...qrCode,
      publicUrl,
    },
  };
}
