"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterState } from "../types";

interface ActiveFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export function ActiveFilters({ filters, onFilterChange }: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.priceRange.map((range) => (
        <Badge key={range} variant="secondary" className="gap-2">
          {range}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0"
            onClick={() =>
              onFilterChange(
                "priceRange",
                filters.priceRange.filter((r) => r !== range),
              )
            }
          >
            ×
          </Button>
        </Badge>
      ))}
      {filters.vendorType.map((type) => (
        <Badge key={type} variant="secondary" className="gap-2">
          {type}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0"
            onClick={() =>
              onFilterChange(
                "vendorType",
                filters.vendorType.filter((t) => t !== type),
              )
            }
          >
            ×
          </Button>
        </Badge>
      ))}
    </div>
  );
}
