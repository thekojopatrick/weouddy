import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useBatchEventStatuses } from "./use-event";

export function useVisibleEvents(eventIds: string[]) {
  const [visibleEvents, setVisibleEvents] = useState<string[]>(eventIds);

  const { ref } = useInView({
    threshold: 0.1,
    onChange: (inView, entry) => {
      if (inView) {
        const eventId = entry.target.getAttribute("data-event-id");
        if (eventId) {
          setVisibleEvents((prev) => [...new Set([...prev, eventId])]);
        }
      }
    },
  });

  const { data: statuses } = useBatchEventStatuses(visibleEvents);

  return { ref, statuses };
}
