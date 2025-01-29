import { EventCache } from "@/types/event";
import { EventWithDetails } from "@/types/prisma.types";
import { create } from "zustand";

export const useEventStore = create<{
  cache: Record<string, EventCache>;
  setCache: (key: string, data: EventWithDetails[]) => void;
}>((set) => ({
  cache: {},
  setCache: (key, data) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: { events: data, timestamp: Date.now() },
      },
    })),
}));
