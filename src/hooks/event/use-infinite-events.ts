import { useInfiniteQuery } from "@tanstack/react-query";

const EVENTS_PER_PAGE = 10;

export function useInfiniteEvents(location = "world") {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["infiniteEvents", location],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/events?page=${pageParam}&location=${location}&limit=${EVENTS_PER_PAGE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 1,
  });

  // Combine and filter events client-side
  const events = data?.pages.flatMap((page) => page.events) ?? [];

  return { events, fetchNextPage, hasNextPage, isLoading };
}
