"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DropdownNavProps, DropdownProps } from "react-day-picker";
import { cn } from "@/lib/utils";

export default function CalendarWithDropdown() {
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCalendarChange = (
    value: string | number,
    onChange: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const event = {
      target: {
        value: String(value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate) setIsCalendarOpen(false);
            }}
            className="rounded-lg border border-border p-2"
            classNames={{
              month_caption: "mx-0",
            }}
            captionLayout="dropdown"
            defaultMonth={date || new Date()}
            components={{
              DropdownNav: (props: DropdownNavProps) => (
                <div className="flex w-full items-center gap-2">
                  {props.children}
                </div>
              ),
              Dropdown: (props: DropdownProps) => (
                <Select
                  value={String(props.value)}
                  onValueChange={(value) => {
                    if (props.onChange) {
                      handleCalendarChange(value, props.onChange);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 w-fit font-medium first:grow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="max-h-[min(26rem,var(--radix-select-content-available-height))]"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    {props.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
