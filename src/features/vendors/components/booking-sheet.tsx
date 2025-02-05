'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Vendor } from '../types';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface BookingSheetProps {
  vendor: Vendor;
  onClose: () => void;
}

export function BookingSheet({ vendor, onClose }: BookingSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Book with {vendor.name}</SheetTitle>
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
              <h3 className="font-medium">Available Time Slots</h3>
              <div className="grid grid-cols-2 gap-2">
                {['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'].map(
                  (time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="w-full"
                    >
                      {time}
                    </Button>
                  )
                )}
              </div>
              <Button className="w-full">Confirm Booking</Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
