import { useInfiniteQuery } from '@tanstack/react-query';

const EVENTS_PER_PAGE = 12;

export function useInfiniteEvents(
  location = 'world',
  category = 'All'
) {
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['infiniteEvents', location, category],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `/api/events?page=${pageParam}&location=${location}&category=${category}&limit=${EVENTS_PER_PAGE}`
        );
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextPage : undefined,
    });

  const events = data?.pages.flatMap((page) => page.events) ?? [];
  return { events, fetchNextPage, hasNextPage, isLoading };
}
