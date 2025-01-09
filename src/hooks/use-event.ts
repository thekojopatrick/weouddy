import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEventStore } from './use-event-cache';
import { useEffect } from 'react';
import { EventWithDetails } from '@/types/prisma.types';

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
