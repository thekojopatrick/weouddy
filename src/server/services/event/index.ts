import { type EventFormValues } from "@/types/validation";
import { db } from "@/server/db/prisma";
import { uploadEventCoverImage } from "@/lib/upload/event-cover-image";
import { nanoid } from "nanoid";
import { generateQRCode } from "@/lib/qr/generator";
import { storeQRCode } from "@/lib/qr/storage";
import {
  AccessType,
  Prisma,
  PrismaClient,
  AttendeeStatus,
} from "@prisma/client";
import { getURL } from "@/lib/utils";
import { cache } from "@/lib/redis";
import { rateLimiter } from "../ratelimiter/rate-limiter.service";

export class EventService {
  private static RATE_LIMIT_MS = 30000;
  private static MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  static async create(data: EventFormValues, userId: string) {
    await rateLimiter.limit({
      identifier: `create-event-${userId}`,
      limit: 1,
      window: 30000,
    });

    return db.$transaction(
      async (tx) => {
        await this.checkRateLimit(tx, userId);
        const [coverImageUrl, qrCode] = await Promise.all([
          this.processCoverImage(data.coverImage),
          this.generateEventQR(),
        ]);

        // Create event with updated schema fields
        const event = await tx.event.create({
          data: {
            name: data.name,
            description: data.description,
            type: data.type,
            location: data.location,
            dateTime: this.parseDateTime(data.date as never, data.time),
            coverImage: coverImageUrl,
            qrCodeUrl: qrCode,
            isPrivate: !data.isPublic,
            hostId: userId,
            slug: nanoid(8),
            accessType: AccessType.DIRECT_PASS,
            requiresApproval: false,
            isDisabled: false,
          },
          include: {
            host: true,
            chatSettings: true,
          },
        });

        // Create default chat settings for the event
        await tx.chatSettings.create({
          data: {
            eventId: event.id,
            isEnabled: false,
            allowGuestMessages: true,
            slowMode: false,
            slowModeInterval: 0,
            requireModeration: false,
          },
        });

        return event;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );
  }

  static async getEvent(identifier: string) {
    const cacheKey = `event:${identifier}`;
    const cachedEvent = await cache.get(cacheKey);
    if (cachedEvent) {
      return cachedEvent;
    }

    const event = await db.event
      .findFirst({
        where: {
          OR: [{ publicId: identifier }, { slug: identifier }],
        },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          attendees: {
            select: {
              userId: true,
              status: true,
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            take: 10,
          },
          posts: {
            include: {
              media: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              comments: {
                include: {
                  user: {
                    select: {
                      name: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
              likes: true,
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
          chatSettings: true,
          eventVendors: {
            include: {
              vendor: true,
            },
          },
          _count: {
            select: {
              attendees: true,
              posts: true,
            },
          },
        },
      })
      .then((event) => ({
        ...event,
        attendeeCount: event?._count.attendees,
      }));

    if (!event?.id) {
      return { message: "Event Not Found" };
    }

    if (event) {
      await cache.set(cacheKey, event, 60);
    }

    return event;
  }

  static async getAll(
    skip: number,
    limit: number,
    location: string | null,
    category: string | null,
    userId?: string,
  ) {
    const where = {
      isDisabled: false,
      ...(userId
        ? {
            OR: [
              { isPrivate: false },
              { hostId: userId },
              {
                attendees: {
                  some: { userId, status: AttendeeStatus.APPROVED },
                },
              },
            ],
          }
        : { isPrivate: false }),
      ...(location && location !== "world" && { location }),
      ...(category && category !== "All" && { type: category }),
    };

    return db.event
      .findMany({
        take: limit,
        skip,
        where,
        include: {
          host: true,
          chatSettings: true,
          eventVendors: {
            include: {
              vendor: true,
            },
          },
          _count: {
            select: {
              attendees: true,
              posts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      .then((events) =>
        events.map((event) => ({
          ...event,
          attendeeCount: event._count.attendees,
        })),
      );
  }

  static async count(
    location: string | null,
    category: string | null,
    userId?: string,
  ) {
    const where = {
      ...(userId
        ? {
            OR: [
              { isPrivate: false },
              { hostId: userId },
              { attendees: { some: { id: userId } } },
            ],
          }
        : { isPrivate: false }),
      ...(location && location !== "world" && { location }),
      ...(category && category !== "All" && { type: category }),
    };

    return db.event.count({ where });
  }

  static async getStats(eventId: string) {
    return db.$transaction(async (tx) => {
      const [attendees, posts, activeUsers] = await Promise.all([
        tx.attendee.count({
          where: {
            eventId,
            status: AttendeeStatus.APPROVED,
          },
        }),
        tx.post.count({ where: { eventId } }),
        tx.user.count({
          where: {
            attendeeEvents: {
              some: {
                eventId,
                status: AttendeeStatus.APPROVED,
              },
            },
            lastActive: { gte: new Date(Date.now() - 300000) },
          },
        }),
      ]);

      return {
        attendeeCount: attendees,
        postCount: posts,
        activeUsers,
      };
    });
  }

  static async updateEventSettings(
    eventId: string,
    userId: string,
    settings: Partial<{
      isPrivate: boolean;
      requiresApproval: boolean;
      allowComments: boolean;
      allowLikes: boolean;
      allowChat: boolean;
      allowPosts: boolean;
      accessType: AccessType;
      pinCode: string | null;
      isDisabled: boolean;
      vendorBudget: number | null;
      vendorCosts: any | null;
    }>,
  ) {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        hostId: userId,
        isDisabled: false,
      },
    });

    if (!event) {
      throw new Error("Only the event host can modify settings");
    }

    const pinCode =
      settings.accessType === AccessType.PIN_REQUIRED ? settings.pinCode : null;

    return db.$transaction(async (tx) => {
      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          ...settings,
          pinCode,
        },
      });

      if (settings.allowChat !== undefined) {
        await tx.chatSettings.update({
          where: { eventId },
          data: { isEnabled: settings.allowChat },
        });
      }

      await cache.del(`event:${eventId}`);
      return updatedEvent;
    });
  }

  private static generatePinCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async validateEventPin(eventId: string, pinCode: string) {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        pinCode: pinCode,
        accessType: AccessType.PIN_REQUIRED,
        isDisabled: false,
      },
    });

    return !!event;
  }

  // Helper methods remain the same
  private static async checkRateLimit(
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    userId: string,
  ) {
    const recentEvent = await tx.event.findFirst({
      where: {
        hostId: userId,
        createdAt: { gte: new Date(Date.now() - this.RATE_LIMIT_MS) },
      },
    });

    if (recentEvent) {
      throw new Error("Please wait before creating another event");
    }
  }

  private static async processCoverImage(base64Image?: string) {
    if (!base64Image) return null;

    const imageBuffer = Buffer.from(base64Image.split(",")[1], "base64");
    if (imageBuffer.length > this.MAX_IMAGE_SIZE) {
      throw new Error("Image exceeds 5MB limit");
    }

    return uploadEventCoverImage(base64Image, nanoid(8));
  }

  private static async generateEventQR() {
    const baseUrl = getURL();
    const shortId = nanoid(8);
    const qrCode = await generateQRCode(`${baseUrl}events/${shortId}`);
    return storeQRCode(shortId, qrCode);
  }

  private static parseDateTime(date: string, time: string) {
    const [hours, minutes] = time.split(":");
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
  }
}
