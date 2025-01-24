'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  EmptyEvents,
  EventType,
  FilterEmptyState,
} from './empty-states';
import { EventWithDetails } from '@/types/prisma.types';
import { fetchUserEvents } from '@/server/actions/user/queries';
import { EventCard } from './user-event-card';

interface UserEventsProps {
  userId: string;
}

export function UserEvents({ userId }: UserEventsProps) {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [eventType, setEventType] = useState<EventType>('all');

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const newEvents = await fetchUserEvents(userId, page);
        if (newEvents.length === 0) {
          setHasMore(false);
        } else {
          setEvents((prev) =>
            page === 1 ? newEvents : [...prev, ...newEvents]
          );
        }
      } catch (error) {
        console.error('Failed to load events', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [userId, page, eventType]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const filteredEvents = events.filter((event) => {
    if (eventType === 'hosted') return event.hostId === userId;
    if (eventType === 'joined') return event.hostId !== userId;
    return true;
  });

  const hasEvents = events.length > 0;

  if (!hasEvents && !isLoading) {
    return <EmptyEvents />;
  }

  return (
    <div className="">
      <div className="flex items-center space-x-4 mb-6">
        {['all', 'hosted', 'joined'].map((type) => (
          <Button
            key={type}
            variant={eventType === type ? 'default' : 'outline'}
            onClick={() => {
              setEventType(type as EventType);
              setPage(1);
            }}
            className="rounded-full shadow-none"
          >
            {type === 'all'
              ? 'All Events'
              : type === 'hosted'
                ? 'Hosted'
                : 'Joined'}
          </Button>
        ))}
      </div>

      {filteredEvents.length === 0 &&
      !isLoading &&
      eventType !== 'all' ? (
        <FilterEmptyState type={eventType} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {hasMore && filteredEvents.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant={'ghost'}
          >
            {isLoading ? 'Loading...' : 'Load More Events'}
          </Button>
        </div>
      )}
    </div>
  );
}
