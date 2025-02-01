import { EventSettings } from "./types";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/redis";
import { AttendeeStatus } from "@prisma/client";

export async function generateEventQRCode(eventId: string, baseUrl: string) {
  const eventUrl = `${baseUrl}/events/${eventId}/room`;
  return QRCode.toDataURL(eventUrl);
}

export async function getEventById(eventId: string) {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      host: true,
      attendees: true,
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

export async function getEventBySlug(slug: string) {
  const cacheKey = `event:${slug}`;

  // Try cache first
  const cachedEvent = await cache.get(cacheKey);
  if (cachedEvent) {
    return cachedEvent;
  }

  const event = prisma.event
    .findUnique({
      where: { slug },
      include: {
        host: true,

        attendees: true,
        posts: {
          include: {
            media: true,
            user: true,
            comments: true,
            likes: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            attendees: true,
          },
        },
      },
    })
    .then((event) => ({
      ...event,

      attendeeCount: event?._count.attendees,
    }));

  if (event) {
    // Cache for 1 minute
    await cache.set(cacheKey, event, 60);
  }

  return event;
}

export async function getAllEvents(userId?: string) {
  if (userId) {
    // For authenticated users, return all events
    return prisma.event
      .findMany({
        where: {
          OR: [
            { isPrivate: false },
            { hostId: userId },
            {
              attendees: {
                some: { id: userId, status: AttendeeStatus.APPROVED },
              },
            },
          ],
        },
        include: {
          host: true,
          _count: {
            select: {
              posts: true,
              attendees: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .then((events) =>
        events.map((event) => ({
          ...event,
          attendeeCount: event._count.attendees,
        })),
      );
  } else {
    // For unauthenticated users, return only public events
    return prisma.event
      .findMany({
        where: {
          isPrivate: false,
        },
        include: {
          host: true,
          _count: {
            select: {
              posts: true,
              attendees: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .then((events) =>
        events.map((event) => ({
          ...event,

          attendeeCount: event._count.attendees,
        })),
      );
  }
}

export async function getEventSettings(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      isPrivate: true,
      isDisabled: true,
      allowComments: true,
      allowLikes: true,
      allowPosts: true,
    },
  });

  if (!event) throw new Error("event not found");
  return event;
}

export async function updateEventSettings(
  eventId: string,
  settings: Partial<EventSettings>,
) {
  return prisma.event.update({
    where: { id: eventId },
    data: {
      ...settings,
    },
  });
}

export async function getEventStats(eventId: string) {
  const [memberCount, postCount, activeMembers] = await Promise.all([
    prisma.event.findUnique({
      where: { id: eventId },
      select: {
        _count: {
          select: { attendees: true },
        },
      },
    }),
    prisma.post.count({
      where: { eventId },
    }),
    prisma.user.count({
      where: {
        attendeeEvents: {
          some: {
            id: eventId,
          },
        },
        lastActive: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Active in last 5 minutes
        },
      },
    }),
  ]);

  return {
    memberCount,
    postCount,
    activeMembers,
  };
}
