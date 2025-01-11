import {
  CategorizedLocation,
  categorizeLocation,
} from '@/lib/location-mapping';
import { useCallback, useMemo, useState } from 'react';

//import { EventData } from "@/types/event";
import { EventWithDetails } from '@/types/prisma.types';

// Define strict types for event and filtering
export interface EventWithLocationDetails extends EventWithDetails {
  locationDetails: CategorizedLocation;
}

export interface FilteringResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}

export function useOptimizedEventFiltering(
  events: EventWithDetails[],
  initialCategory = 'All'
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize events with location details
  const memoizedEvents = useMemo<EventWithLocationDetails[]>(() => {
    try {
      setIsLoading(true);
      const processedEvents = events.map((event) => ({
        ...event,
        locationDetails: categorizeLocation(event.location!),
      }));
      setIsLoading(false);
      return processedEvents;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Event processing failed')
      );
      setIsLoading(false);
      return [];
    }
  }, [events]);

  // Memoized filtering function with comprehensive type checking
  const filterEvents = useCallback(
    (
      location: string,
      category: string = initialCategory
    ): FilteringResult<EventWithLocationDetails> => {
      if (!memoizedEvents.length) {
        return {
          data: [],
          isLoading: false,
          error: null,
        };
      }

      try {
        const filteredEvents = memoizedEvents.filter((event) => {
          const locationMatch =
            location === 'world' ||
            location.toLowerCase() ===
              event.locationDetails.region.toLowerCase() ||
            location.toLowerCase() ===
              event.locationDetails.country.toLowerCase() ||
            location.toLowerCase() ===
              event.locationDetails.city.toLowerCase();

          const categoryMatch =
            category === 'All' ||
            event.type.toLowerCase() === category.toLowerCase();

          return locationMatch && categoryMatch;
        });

        return {
          data: filteredEvents,
          isLoading: false,
          error: null,
        };
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Filtering failed');
        return {
          data: [],
          isLoading: false,
          error,
        };
      }
    },
    [initialCategory, memoizedEvents]
  );

  return {
    filterEvents,
    memoizedEvents,
    isLoading,
    error,
  };
}
