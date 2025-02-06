import { cache } from "@/lib/redis";
import { db } from "@/server/db/prisma";
import { AttendeeStatus, EventVendor, Prisma } from "@prisma/client";
import { performance } from "perf_hooks";

interface GetAllEventsOptions {
  skip: number;
  limit: number;
  location: string | null;
  category: string | null;
  userId?: string;
  includeVendors?: boolean;
}

type VendorDataMap = Record<string, EventVendor[]>;

export class EventService {
  private static CACHE_TTL = 60; // 1 minute cache
  private static MAX_QUERY_TIME = 5000; // 5 seconds

  static async getAll({
    skip,
    limit,
    location,
    category,
    userId,
    includeVendors = false,
  }: GetAllEventsOptions) {
    const startTime = performance.now();

    // Generate cache key based on query parameters
    const cacheKey = `events:${location}:${category}:${skip}:${limit}:${userId}:${includeVendors}`;

    try {
      // Try to get from cache first
      const cachedEvents = await cache.get(cacheKey);
      if (cachedEvents) {
        return cachedEvents;
      }

      // Build the base where clause
      const where: Prisma.EventWhereInput = {
        isDisabled: false,
        ...(userId
          ? {
              OR: [
                { isPrivate: false },
                { hostId: userId },
                {
                  attendees: {
                    some: {
                      userId,
                      status: AttendeeStatus.APPROVED,
                    },
                  },
                },
              ],
            }
          : { isPrivate: false }),
        ...(location && location !== "world" && { location }),
        ...(category && category !== "All" && { type: category }),
      };

      // Split into two queries: one for basic event data and another for additional details
      const [events, eventCounts] = await db.$transaction([
        // Basic event query
        db.event.findMany({
          take: limit,
          skip,
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            location: true,
            type: true,
            dateTime: true,
            coverImage: true,
            isPrivate: true,
            createdAt: true,
            host: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            chatSettings: {
              select: {
                isEnabled: true,
                allowGuestMessages: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),

        // Counts query
        db.event.findMany({
          where,
          take: limit,
          skip,
          select: {
            id: true,
            _count: {
              select: {
                attendees: true,
                posts: true,
              },
            },
          },
        }),
      ]);

      // If vendors are requested, fetch them separately
      let vendorData: VendorDataMap = {};
      if (includeVendors && events.length > 0) {
        const eventVendors = await db.eventVendor.findMany({
          where: {
            eventId: {
              in: events.map((e) => e.id),
            },
          },
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Group vendors by event
        vendorData = eventVendors.reduce((acc, vendor) => {
          if (!acc[vendor.eventId]) {
            acc[vendor.eventId] = [];
          }
          acc[vendor.eventId].push(vendor);
          return acc;
        }, {} as VendorDataMap);
      }

      // Check if query time exceeds limit
      const queryTime = performance.now() - startTime;
      if (queryTime > this.MAX_QUERY_TIME) {
        console.warn(`Slow query detected: ${queryTime}ms for events list`);
        // Could add monitoring/alerting here
      }

      // Combine the results
      const enrichedEvents = events.map((event) => {
        const counts = eventCounts.find((e) => e.id === event.id)?._count || {
          attendees: 0,
          posts: 0,
        };
        return {
          ...event,
          attendeeCount: counts.attendees,
          postCount: counts.posts,
          ...(includeVendors && {
            eventVendors: vendorData[event.id] || [],
          }),
        };
      });

      // Cache the results
      await cache.set(cacheKey, enrichedEvents, this.CACHE_TTL);

      return enrichedEvents;
    } catch (error) {
      console.error("Error in getAll events:", error);
      // Add error tracking here if needed (e.g., Sentry)
      throw new Error("Failed to fetch events");
    }
  }

  // Helper method to invalidate cache for specific parameters
  static async invalidateEventsCache(params: Partial<GetAllEventsOptions>) {
    const cachePattern = `events:${params.location || "*"}:${params.category || "*"}:*`;
    await cache.del(cachePattern);
  }
}
