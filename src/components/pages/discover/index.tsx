'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';

//components
import { CategoryFilters } from './category-filters';
import { CreateEventButton } from '@/components/create-event-button';
import { EventCard } from '@/components/event/event-card';
import { EventListShimmer } from '@/components/event/shimmer-loading';
import { JoinEventButton } from '@/components/join-event-button';
import { LocationFilters } from './location-filters';

//types
import { EventWithDetails } from '@/types/prisma.types';
import { User } from '@supabase/supabase-js';

//utils
import { cn } from '@/lib/utils';
import { formatEventDateTime } from '@/lib/formatters';

//hooks
import { useAuthProtection } from '@/hooks/use-auth-protection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useInfiniteEvents } from '@/hooks/event/use-infinite-events';
import { useVisibleEvents } from '@/hooks/event/use-visible-events';
import { Container } from '@/components/common/container';
import FilterDrawer from './filter-drawer';

export default function DiscoverPage({
  user,
}: {
  user: User & { username: string | null; avatarUrl: string | null };
}) {
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 768px)'
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const { protectAction } = useAuthProtection();

  const [currentLocation, setCurrentLocation] = useState(
    searchParams.get('location') || 'world'
  );
  const [currentCategory, setCurrentCategory] = useState('All');

  const { events, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteEvents(currentLocation, currentCategory);

  const eventIds =
    events?.map((event: EventWithDetails) => event.id) ?? [];
  const { ref, statuses } = useVisibleEvents(eventIds);

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    },
  });

  // Handle location change
  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
    router.push(`/discover?location=${location}`, { scroll: false });
  };

  // Compute available categories
  const availableCategories = useMemo(
    () => [
      'All',
      ...new Set(
        events?.flatMap((event: EventWithDetails) => event.type)
      ),
    ],
    [events]
  ) as string[];

  return (
    <div className="flex min-h-screen flex-col mt-4 pb-8 md:pb-16">
      <Container>
        <section className="flex-1">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tighter">
              Discover
            </h1>
            <p className="text-muted-foreground">
              Explore events, moments near you, browse by category, or
              search events by name.
            </p>
          </div>
          {isLoading ? (
            <div className="w-full">
              <EventListShimmer />
            </div>
          ) : (
            <>
              <div className="mt-4">
                <LocationFilters
                  currentLocation={currentLocation}
                  onLocationChangeAction={handleLocationChange}
                />
                <div className="flex items-center justify-between py-4">
                  <CategoryFilters
                    onCategoryChangeAction={setCurrentCategory}
                    currentCategory={currentCategory}
                    categories={availableCategories}
                  />
                  <FilterDrawer
                    categories={availableCategories}
                    locations={['world', 'africa']}
                    currentCategory={currentCategory}
                    currentLocation={currentLocation}
                    onCategoryChange={setCurrentCategory}
                    onLocationChange={handleLocationChange}
                  />
                </div>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No events found for the selected filters.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {events.map((event) => {
                    const { date, time } = formatEventDateTime(
                      event.dateTime as never
                    );
                    return (
                      <div
                        key={event.id}
                        ref={ref}
                        data-event-id={event.id}
                      >
                        <EventCard
                          key={event.id}
                          {...event}
                          date={date}
                          time={time}
                          coverImage={event.coverImage!}
                          members={event.memberCount}
                          category={event.type}
                          location={event.location!}
                          slug={event.slug!}
                          accessType={event.accessType as never}
                          description={event.description!}
                          userStatus={statuses?.[event.id]}
                        />
                      </div>
                    );
                  })}
                  <div ref={loadMoreRef} className="h-10" />
                </div>
              )}
            </>
          )}
        </section>
      </Container>
      {/*CALL TO ACTION */}

      <div
        className={cn(
          'fixed bottom-8 flex flex-col gap-4 z-50 items-end',
          isSmallDevice ? 'right-5' : 'right-8'
        )}
      >
        {/* Wrap JoinEventButton with auth protection */}
        <div
          onClick={() =>
            protectAction(
              user,
              () => (
                <JoinEventButton
                  isSmallDevice={isSmallDevice}
                  user={user as never}
                />
              ),
              'join an event'
            )
          }
        >
          <JoinEventButton
            isSmallDevice={isSmallDevice}
            user={user as never}
          />
        </div>

        {/* Wrap CreateEventButton with auth protection */}
        <div
          onClick={() =>
            protectAction(
              user,
              () => (
                <CreateEventButton
                  isSmallDevice={isSmallDevice}
                  user={user as never}
                />
              ),
              'create an event'
            )
          }
        >
          <CreateEventButton
            isSmallDevice={isSmallDevice}
            user={user as never}
          />
        </div>
      </div>
    </div>
  );
}
