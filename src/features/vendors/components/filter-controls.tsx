'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { PriceRange, VendorType } from '../types';
import { Switch } from '@/components/ui/switch';
import { FilterState } from '../types';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export function FilterControls({
  filters,
  onFilterChange,
}: FilterControlsProps) {
  return (
    <div className="mt-6 space-y-6">
      <SheetHeader>
        <SheetTitle>Filter Vendors</SheetTitle>
      </SheetHeader>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['BUDGET', 'MIDRANGE', 'LUXURY'].map((range) => (
                <div key={range} className="flex items-center gap-2">
                  <Switch
                    checked={filters.priceRange.includes(
                      range as PriceRange
                    )}
                    onCheckedChange={(checked) => {
                      const newRanges = checked
                        ? [...filters.priceRange, range as PriceRange]
                        : filters.priceRange.filter(
                            (r) => r !== range
                          );
                      onFilterChange('priceRange', newRanges);
                    }}
                  />
                  <span>{range}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Vendor Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                'VENUE',
                'CATERER',
                'PHOTOGRAPHER',
                'ENTERTAINMENT',
                'DECOR',
              ].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Switch
                    checked={filters.vendorType.includes(
                      type as VendorType
                    )}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...filters.vendorType, type as VendorType]
                        : filters.vendorType.filter(
                            (t) => t !== type
                          );
                      onFilterChange('vendorType', newTypes);
                    }}
                  />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Minimum Rating</AccordionTrigger>
          <AccordionContent>
            <Slider
              value={[filters.rating]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={([value]) =>
                onFilterChange('rating', value)
              }
            />
            <div className="mt-2 text-center">
              {filters.rating} Stars
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
