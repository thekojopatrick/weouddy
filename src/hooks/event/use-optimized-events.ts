import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { EventWithDetails } from '@/types/prisma.types';
import debounce from 'lodash.debounce';

const EVENTS_PER_PAGE = 10;
const DEBOUNCE_MS = 300;

export function useOptimizedEvents(
  location = 'world',
  category = 'All'
) {
  // Create a stable fetch function
  const fetchEvents = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `/api/events?page=${pageParam}&location=${location}&limit=${EVENTS_PER_PAGE}`
    );
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  };

  // Set up the infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['infiniteEvents', location, category],
    queryFn: fetchEvents,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 1,
    staleTime: 60000, // Consider data fresh for 1 minute
    gcTime: 300000, // Keep in cache for 5 minutes
  });

  // Debounced refetch function
  const debouncedRefetch = useMemo(
    () =>
      debounce(() => {
        refetch();
      }, DEBOUNCE_MS),
    [refetch]
  );

  // Handle filter changes
  useEffect(() => {
    debouncedRefetch();

    return () => {
      debouncedRefetch.cancel();
    };
  }, [location, category, debouncedRefetch]);

  // Client-side category filtering
  const events = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.events)
        .filter(
          (event: EventWithDetails) =>
            category === 'All' || event.type === category
        ) ?? [],
    [data?.pages, category]
  );

  return {
    events,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isRefetching: isFetching,
  };
}
