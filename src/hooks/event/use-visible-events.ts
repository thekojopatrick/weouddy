import { EventWithDetails } from '@/types/prisma.types';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useBatchEventStatuses } from './use-event';

export function useVisibleEvents(events: EventWithDetails[]) {
  const [visibleEvents, setVisibleEvents] = useState<string[]>([]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    onChange: (inView, entry) => {
      if (inView) {
        const eventId = entry.target.getAttribute('data-event-id');
        if (eventId) {
          setVisibleEvents((prev) => [
            ...new Set([...prev, eventId]),
          ]);
        }
      }
    },
  });

  const { data: statuses } = useBatchEventStatuses(visibleEvents);

  return { ref, statuses };
}
