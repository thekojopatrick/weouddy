"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const locations = [
  { name: "Accra", param: "accra" },
  { name: "Lagos", param: "lagos" },
  { name: "Ghana", param: "ghana" },
  { name: "Nigeria", param: "nigeria" },
  { name: "Africa", param: "africa" },
  { name: "Rest of the world", param: "world" },
];

interface LocationFiltersProps {
  currentLocation: string;
  onLocationChangeAction: (location: string) => void;
}

export function LocationFilters({
  currentLocation,
  onLocationChangeAction,
}: LocationFiltersProps) {
  const router = useRouter();

  const handleLocationClick = (locationParam: string) => {
    onLocationChangeAction(locationParam);
    router.push(`/discover?location=${locationParam}`, {
      scroll: false,
    });
  };

  return (
    <nav className="location-filters">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {locations.map((location) => (
            <button
              key={location.name}
              onClick={() => handleLocationClick(location.param)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                currentLocation === location.param
                  ? "text-primary underline underline-offset-2"
                  : "text-muted-foreground",
              )}
            >
              {location.name}
            </button>
          ))}
          <ScrollBar orientation="horizontal" className="h-1" />
        </div>
      </ScrollArea>
    </nav>
  );
}
