'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, SortAsc } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterState } from '../types';
import { FilterControls } from './filter-controls';
import { ActiveFilters } from './active-filters';

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export function FilterSection({
  filters,
  onFilterChange,
}: FilterSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <FilterControls
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </SheetContent>
        </Sheet>

        <Select
          value={filters.sortBy}
          onValueChange={(value: FilterState['sortBy']) =>
            onFilterChange('sortBy', value)
          }
        >
          <SelectTrigger className="w-[180px] gap-2">
            <SortAsc className="h-4 w-4" />
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price_low">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price_high">
              Price: High to Low
            </SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ActiveFilters
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
