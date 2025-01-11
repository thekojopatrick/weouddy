'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CategoryFilters } from '@/components/category-filters';
import { CreateEventButton } from '@/components/create-event-button';
import { EventCard } from '@/components/event/event-card';
import { EventListShimmer } from '@/components/event/shimmer-loading';
import { EventWithDetails } from '@/types/prisma.types';
import { JoinEventButton } from '@/components/join-event-button';
import { LocationFilters } from '@/components/location-filters';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { formatEventDateTime } from '@/lib/formatters';
import { useAuthProtection } from '@/hooks/use-auth-protection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useOptimizedEventFiltering } from '@/hooks/event/use-optimized-event-location';
import {
  useBatchEventStatuses,
  useEvents,
} from '@/hooks/event/use-event';

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

  const { events, isLoading: DataLoading } = useEvents(
    currentLocation,
    currentCategory
  );

  const eventIds =
    events?.map((event: EventWithDetails) => event.id) ?? [];
  const { data: statuses } = useBatchEventStatuses(eventIds);

  const { filterEvents, isLoading } = useOptimizedEventFiltering(
    events as EventWithDetails[]
  );

  // Compute filtered events
  const filteredEvents = useMemo(
    () => filterEvents(currentLocation, currentCategory),
    [currentLocation, currentCategory, filterEvents]
  );

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
        events?.map((event: EventWithDetails) => event.type)
      ),
    ],
    [events]
  ) as string[];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="max-w-7xl px-6 py-8 mx-auto">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tighter">
              Discover Events
            </h1>
            <p className="text-muted-foreground">
              Explore events near you, browse by category, or search
              events by name.
            </p>
          </div>
          {isLoading || DataLoading ? (
            <div className="max-w-7xl px-6 py-8 mx-auto">
              <EventListShimmer />
            </div>
          ) : (
            <>
              <div className="mt-8">
                <LocationFilters
                  currentLocation={currentLocation}
                  onLocationChangeAction={handleLocationChange}
                />
                <CategoryFilters
                  onCategoryChangeAction={setCurrentCategory}
                  currentCategory={currentCategory}
                  categories={availableCategories}
                />
              </div>

              {filteredEvents.data.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No events found for the selected filters.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredEvents.data.map((event) => {
                    const { date, time } = formatEventDateTime(
                      event.dateTime as never
                    );
                    return (
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
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
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
