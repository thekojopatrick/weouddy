import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useEffect } from 'react';
import { EventWithDetails } from '@/types/prisma.types';
import { UserEventStatus } from '@/types/event';
import * as Sentry from '@sentry/nextjs';
import { useEventStore } from './use-event-cache';

export function useEvents(location = 'world', category = 'All') {
  const queryClient = useQueryClient();
  const { cache, setCache } = useEventStore();
  const cacheKey = `${location}-${category}`;
  const cachedData = cache[cacheKey];

  const { data, isLoading } = useQuery({
    queryKey: ['events', location, category],
    queryFn: async () => {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    staleTime: 60000,
    initialData:
      cachedData?.timestamp > Date.now() - 60000
        ? (cachedData.events as EventWithDetails[])
        : undefined,
  });

  useEffect(() => {
    if (data) setCache(cacheKey, data);
  }, [data, cacheKey, setCache]);

  // Expose invalidate function
  const invalidateEvents = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  return { events: data, isLoading, invalidateEvents };
}

export const useEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const res = await fetch(`/api/events/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    enabled: !!slug,
  });
};

export const useEventStatus = (eventId: string) => {
  return useQuery({
    queryKey: ['eventStatus', eventId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/status`);
        if (!response.ok) {
          throw new Error('Failed to fetch event status');
        }
        const data = await response.json();
        return data.status as UserEventStatus;
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    },
    // Cache the status for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep the data in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useBatchEventStatuses = (eventIds: string[]) => {
  return useQuery({
    queryKey: ['eventStatuses', eventIds],
    queryFn: async () => {
      try {
        const response = await fetch('/api/events/batch-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventIds }),
        });

        if (!response.ok) {
          console.error('API Response Error:', await response.text());
          throw new Error('Failed to fetch event statuses');
        }

        return response.json() as Promise<
          Record<string, UserEventStatus>
        >;
      } catch (error) {
        console.error('Error fetching event statuses:', error);
        Sentry.captureException(error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
