import { useInfiniteQuery } from '@tanstack/react-query';
import { EventWithDetails } from '@/types/prisma.types';

const EVENTS_PER_PAGE = 10;

export function useInfiniteEvents(
  location = 'world',
  category = 'All'
) {
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['infiniteEvents', location],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `/api/events?page=${pageParam}&location=${location}&limit=${EVENTS_PER_PAGE}`
        );
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextPage : undefined,
      initialPageParam: 1,
    });

  // Combine and filter events client-side
  const events =
    data?.pages
      .flatMap((page) => page.events)
      .filter(
        (event: EventWithDetails) =>
          category === 'All' || event.type === category
      ) ?? [];

  return { events, fetchNextPage, hasNextPage, isLoading };
}
