import { EventFormValues } from "@/types/validation";
import { generateQRCode } from "@/lib/qr/generator";
import { generateSlug } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { storeQRCode } from "@/lib/qr/storage";

export async function createEvent(data: EventFormValues, userId: string) {
  const [hours, minutes] = data.time.split(":");
  const dateTime = new Date(data.date);
  dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

  // Create event with initial settings
  const event = await prisma.event.create({
    data: {
      name: data.title,
      description: data.description,
      type: data.type,
      location: data.location,
      dateTime: dateTime,
      coverImage: data.coverImage,
      isPrivate: data.isPublic,
      hostId: userId,
      slug: generateSlug(data.title),
    },
    include: {
      host: true,
    },
  });

  // Generate and store QR code
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const eventUrl = `${baseUrl}/events/${event.id}/room`;
  const qrCode = await generateQRCode(eventUrl);
  const publicUrl = await storeQRCode(event.id, qrCode);

  // Update event with QR code URL
  const updatedevent = await prisma.event.update({
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
    ...updatedevent,
    qrCode: {
      ...qrCode,
      publicUrl,
    },
  };
}
