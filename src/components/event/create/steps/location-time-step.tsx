'use client';

import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Time, parseTime } from '@internationalized/date';
import { addDays, format, subDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { LocationModal } from '@/components/location/location-modal';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { DropdownNavProps, DropdownProps } from 'react-day-picker';
import {
  DateField,
  TimeField,
  DateInput,
} from '@/components/ui/datefield-rac';

interface LocationTimeStepProps {
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export function LocationTimeStep({
  onNext,
  onBack,
  disabled = false,
}: LocationTimeStepProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { setValue, watch } = useFormContext();
  const timeValue = watch('time');

  const handleTimeQuickSelect = (quickTime: string) => {
    const now = new Date();
    switch (quickTime) {
      case 'now':
        setValue('date', now.toISOString());
        setValue('time', format(now, 'HH:mm'));
        break;
      case 'today':
        setValue('date', now.toISOString());
        break;
      case 'tomorrow':
        const tomorrow = addDays(now, 1);
        setValue('date', tomorrow.toISOString());
        break;
      case 'yesterday':
        const yesterday = subDays(now, 1);
        setValue('date', yesterday.toISOString());
        break;
    }
  };

  const handleTimeChange = (time: Time | null) => {
    if (time) {
      const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
      setValue('time', formattedTime);
    }
  };

  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <div className="space-y-6 pb-5 md:py-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">
          Location & DateTime
        </h2>
        <p className="text-muted-foreground text-sm">
          Turn your gathering into a celebration and let your world
          shine.
        </p>
      </div>

      <FormField
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium">
              Where is your event taking place?
            </FormLabel>
            <FormControl>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start truncate py-5 rounded-full shadow-none bg-zinc-50"
                onClick={() => setShowLocationModal(true)}
              >
                <MapPin className="h-4 w-4 text-zinc-500" />
                {field.value || 'Select location'}
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="font-medium">
              When is your event happening?
            </FormLabel>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger
                  asChild
                  className="py-5 bg-zinc-50 shadow-none rounded-full"
                >
                  <FormControl className="grow">
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-4 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value) : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date?.toISOString())
                    }
                    initialFocus
                    className="rounded-lg border border-border p-2"
                    classNames={{
                      month_caption: 'mx-0',
                    }}
                    captionLayout="dropdown"
                    defaultMonth={new Date()}
                    startMonth={new Date(1980, 6)}
                    components={{
                      DropdownNav: (props: DropdownNavProps) => {
                        return (
                          <div className="flex w-full items-center gap-2">
                            {props.children}
                          </div>
                        );
                      },
                      Dropdown: (props: DropdownProps) => {
                        return (
                          <Select
                            value={String(props.value)}
                            onValueChange={(value) => {
                              if (props.onChange) {
                                handleCalendarChange(
                                  value,
                                  props.onChange
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 w-fit font-medium first:grow">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
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
                        );
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Select onValueChange={handleTimeQuickSelect}>
                <SelectTrigger className="w-[120px] rounded-full shadow-none py-5 text-sm">
                  <SelectValue
                    placeholder="Quick Date"
                    className="text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Now</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="time"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="font-medium">
              What time is your event happening?
            </FormLabel>
            <div className="flex space-x-2 items-center">
              <FormControl className="grow">
                <TimeField
                  value={
                    field.value
                      ? parseTime(field.value)
                      : parseTime(format(new Date(), 'HH:mm'))
                  }
                  onChange={handleTimeChange}
                >
                  <DateInput
                    className={cn(
                      'rounded-full bg-zinc-50 py-5',
                      'relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap border border-input px-3 text-sm shadow-none shadow-black/5 transition-shadow data-[focus-within]:border-ring data-disabled:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20'
                    )}
                  />
                </TimeField>
              </FormControl>
              <Button
                type="button"
                variant="outline"
                className="rounded-full py-5"
                onClick={() => handleTimeQuickSelect('now')}
              >
                <Clock className="h-4 w-4" /> Now
              </Button>
            </div>
          </FormItem>
        )}
      />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full shadow-none"
          disabled={disabled}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (!timeValue) {
              setValue('time', format(new Date(), 'HH:mm'));
            }
            onNext();
          }}
          className="rounded-full"
          disabled={disabled}
        >
          Next
        </Button>
      </div>

      <LocationModal
        open={showLocationModal}
        onOpenChangeAction={setShowLocationModal}
        onSelectLocationAction={(location) => {
          setValue('location', location.name);
        }}
      />
    </div>
  );
}
