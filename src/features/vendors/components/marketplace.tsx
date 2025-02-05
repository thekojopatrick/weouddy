'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  CheckCircle,
  Filter,
  SortAsc,
  Calendar as CalendarIcon,
} from 'lucide-react';
import type { Vendor, VendorType, PriceRange } from '../types';

interface FilterState {
  priceRange: PriceRange[];
  vendorType: VendorType[];
  rating: number;
  location: string;
  availableOnly: boolean;
  sortBy: 'rating' | 'price_low' | 'price_high' | 'reviews';
}

const VendorFiltersAndBooking = ({
  vendors,
}: {
  vendors: Vendor[];
}) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    vendorType: [],
    rating: 0,
    location: '',
    availableOnly: false,
    sortBy: 'rating',
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = (vendors: Vendor[]) => {
    return vendors
      .filter((vendor) => {
        if (
          filters.priceRange.length &&
          !filters.priceRange.includes(vendor.priceRange)
        ) {
          return false;
        }
        if (
          filters.vendorType.length &&
          !filters.vendorType.includes(vendor.type)
        ) {
          return false;
        }
        if (filters.rating && vendor.rating < filters.rating) {
          return false;
        }
        if (
          filters.location &&
          !vendor.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_low':
            return (
              (a.packages[0]?.price || 0) -
              (b.packages[0]?.price || 0)
            );
          case 'price_high':
            return (
              (b.packages[0]?.price || 0) -
              (a.packages[0]?.price || 0)
            );
          case 'reviews':
            return b.reviews.length - a.reviews.length;
          default:
            return b.rating - a.rating;
        }
      });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Filter Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Vendors</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {['BUDGET', 'MIDRANGE', 'LUXURY'].map(
                          (range) => (
                            <div
                              key={range}
                              className="flex items-center gap-2"
                            >
                              <Switch
                                checked={filters.priceRange.includes(
                                  range as PriceRange
                                )}
                                onCheckedChange={(checked) => {
                                  const newRanges = checked
                                    ? [
                                        ...filters.priceRange,
                                        range as PriceRange,
                                      ]
                                    : filters.priceRange.filter(
                                        (r) => r !== range
                                      );
                                  handleFilterChange(
                                    'priceRange',
                                    newRanges
                                  );
                                }}
                              />
                              <span>{range}</span>
                            </div>
                          )
                        )}
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
                          <div
                            key={type}
                            className="flex items-center gap-2"
                          >
                            <Switch
                              checked={filters.vendorType.includes(
                                type as VendorType
                              )}
                              onCheckedChange={(checked) => {
                                const newTypes = checked
                                  ? [
                                      ...filters.vendorType,
                                      type as VendorType,
                                    ]
                                  : filters.vendorType.filter(
                                      (t) => t !== type
                                    );
                                handleFilterChange(
                                  'vendorType',
                                  newTypes
                                );
                              }}
                            />
                            <span>{type}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rating">
                    <AccordionTrigger>
                      Minimum Rating
                    </AccordionTrigger>
                    <AccordionContent>
                      <Slider
                        value={[filters.rating]}
                        min={0}
                        max={5}
                        step={0.5}
                        onValueChange={([value]) =>
                          handleFilterChange('rating', value)
                        }
                      />
                      <div className="mt-2 text-center">
                        {filters.rating} Stars
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>

          <Select
            value={filters.sortBy}
            onValueChange={(value: FilterState['sortBy']) =>
              handleFilterChange('sortBy', value)
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

        <div className="flex items-center gap-2">
          <Switch
            checked={filters.availableOnly}
            onCheckedChange={(checked) =>
              handleFilterChange('availableOnly', checked)
            }
          />
          <span className="text-sm">Available Only</span>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2">
        {filters.priceRange.map((range) => (
          <Badge key={range} variant="secondary" className="gap-2">
            {range}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() =>
                handleFilterChange(
                  'priceRange',
                  filters.priceRange.filter((r) => r !== range)
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
                handleFilterChange(
                  'vendorType',
                  filters.vendorType.filter((t) => t !== type)
                )
              }
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>

      {/* Booking Calendar Sheet */}
      {bookingVendor && (
        <Sheet
          open={!!bookingVendor}
          onOpenChange={() => setBookingVendor(null)}
        >
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Book with {bookingVendor.name}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedDate && (
                <div className="space-y-4">
                  <h3 className="font-medium">
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '9:00 AM',
                      '10:00 AM',
                      '2:00 PM',
                      '3:00 PM',
                    ].map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full">Confirm Booking</Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Filtered Vendors List */}
      <div className="space-y-4">
        {applyFilters(vendors).map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground">
                {vendor.type}
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setBookingVendor(vendor)}
            >
              <CalendarIcon className="h-4 w-4" />
              Book Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorFiltersAndBooking;
