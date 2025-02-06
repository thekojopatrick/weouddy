"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { Availability } from "../types";

interface VendorCalendarProps {
  availability: Availability[];
  onDateSelect: (date: Date, timeSlots: Availability["timeSlots"]) => void;
}

export default function VendorCalendar({
  availability,
  onDateSelect,
}: VendorCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const availableDates = availability.map((a) => a.date);

  return (
    <div className="space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                const dayAvailability = availability.find(
                  (a) => a.date.toDateString() === date.toDateString(),
                );
                if (dayAvailability) {
                  onDateSelect(date, dayAvailability.timeSlots);
                }
              }
            }}
            disabled={(date) =>
              !availableDates.some(
                (d) => d.toDateString() === date.toDateString(),
              )
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
