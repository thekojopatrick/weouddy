import { type EventFormValues } from '@/types/validation';
import { db } from '@/server/db/prisma';
import { uploadEventCoverImage } from '@/lib/supabase/upload/event-cover-image';
import { nanoid } from 'nanoid';
import { generateQRCode } from '@/lib/qr/generator';
import { storeQRCode } from '@/lib/qr/storage';
import { Prisma, PrismaClient } from '@prisma/client';
import { getURL } from '@/lib/utils';

export class EventService {
  private static RATE_LIMIT_MS = 30000;
  private static MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  static async create(data: EventFormValues, userId: string) {
    return db.$transaction(
      async (tx) => {
        await this.checkRateLimit(tx, userId);
        const [coverImageUrl, qrCode] = await Promise.all([
          this.processCoverImage(data.coverImage),
          this.generateEventQR(),
        ]);

        return tx.event.create({
          data: {
            name: data.title,
            description: data.description,
            type: data.type,
            location: data.location,
            dateTime: this.parseDateTime(data.date, data.time),
            coverImage: coverImageUrl,
            qrCodeUrl: qrCode,
            isPrivate: !data.isPublic,
            hostId: userId,
            slug: nanoid(8),
          },
          include: { host: true },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
  }

  static async getAll(userId?: string) {
    const where = userId
      ? {
          OR: [
            { isPrivate: false },
            { hostId: userId },
            { members: { some: { id: userId } } },
          ],
        }
      : { isPrivate: false };

    return db.event
      .findMany({
        where,
        include: {
          host: true,
          _count: {
            select: {
              members: true,
              posts: true,
              attendees: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      .then((events) =>
        events.map((event) => ({
          ...event,
          memberCount: event._count.members,
          attendeeCount: event._count.attendees,
        }))
      );
  }

  static async getBySlug(slug: string) {
    return db.event.findUnique({
      where: { slug },
      include: {
        host: true,
        members: true,
        posts: {
          include: {
            user: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  static async getStats(eventId: string) {
    return db.$transaction(async (tx) => {
      const [members, posts, activeUsers] = await Promise.all([
        tx.event.findUnique({
          where: { id: eventId },
          select: { _count: { select: { members: true } } },
        }),
        tx.post.count({ where: { eventId } }),
        tx.user.count({
          where: {
            joinedEvents: { some: { id: eventId } },
            lastActive: { gte: new Date(Date.now() - 300000) },
          },
        }),
      ]);

      return {
        memberCount: members?._count.members ?? 0,
        postCount: posts,
        activeUsers,
      };
    });
  }

  private static async checkRateLimit(
    tx: Omit<
      PrismaClient,
      | '$connect'
      | '$disconnect'
      | '$on'
      | '$transaction'
      | '$use'
      | '$extends'
    >,
    userId: string
  ) {
    const recentEvent = await tx.event.findFirst({
      where: {
        hostId: userId,
        createdAt: { gte: new Date(Date.now() - this.RATE_LIMIT_MS) },
      },
    });

    if (recentEvent) {
      throw new Error('Please wait before creating another event');
    }
  }

  private static async processCoverImage(base64Image?: string) {
    if (!base64Image) return null;

    const imageBuffer = Buffer.from(
      base64Image.split(',')[1],
      'base64'
    );
    if (imageBuffer.length > this.MAX_IMAGE_SIZE) {
      throw new Error('Image exceeds 5MB limit');
    }

    return uploadEventCoverImage(base64Image, nanoid(8));
  }

  private static async generateEventQR() {
    const baseUrl = getURL();
    const shortId = nanoid(8);
    const qrCode = await generateQRCode(
      `${baseUrl}events/${shortId}`
    );
    return storeQRCode(shortId, qrCode);
  }

  private static parseDateTime(date: string, time: string) {
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
  }
}
