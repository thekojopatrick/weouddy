"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";

interface Country {
  label: string;
  value: string;
}

const COUNTRIES: readonly Country[] = [
  { label: "Ghana", value: "GH" },
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "Canada", value: "CA" },
  { label: "Australia", value: "AU" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "Japan", value: "JP" },
  { label: "Brazil", value: "BR" },
  { label: "India", value: "IN" },
] as const;

const DEFAULT_COUNTRY = "GH";

interface CountrySelectorProps {
  selectedCountry?: string;
  onCountryChange?: (countryCode: string) => void;
  className?: string;
}

export function CountrySelector({
  selectedCountry = DEFAULT_COUNTRY,
  onCountryChange,
  className,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedCountry);
  const [isLoading, setIsLoading] = React.useState(true);

  // Function to detect user's country
  const detectUserCountry = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      // Check if the detected country is in our list
      const detectedCountry = COUNTRIES.find(
        (country) => country.value === data.country,
      );

      if (detectedCountry) {
        setValue(detectedCountry.value);
        onCountryChange?.(detectedCountry.value);
      }
    } catch (error) {
      console.error("Error detecting country:", error);
      // Fallback to default country if detection fails
      setValue(DEFAULT_COUNTRY);
      onCountryChange?.(DEFAULT_COUNTRY);
    } finally {
      setIsLoading(false);
    }
  }, [onCountryChange]);

  // Detect country on component mount
  React.useEffect(() => {
    detectUserCountry();
  }, [detectUserCountry]);

  // Effect to notify parent component of country change
  React.useEffect(() => {
    onCountryChange?.(value);
  }, [value, onCountryChange]);

  // Memoized filtered countries for performance
  const filteredCountries = React.useMemo(
    () =>
      COUNTRIES?.filter(
        (country) =>
          country.label.toLowerCase().includes(value.toLowerCase()) ||
          country.value.toLowerCase().includes(value.toLowerCase()),
      ),
    [value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[50px] justify-between px-1",
            isLoading && "opacity-50",
            className,
          )}
          disabled={isLoading}
        >
          <ReactCountryFlag
            countryCode={value}
            svg
            style={{
              width: "2em",
              height: "2em",
            }}
          />
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredCountries?.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <ReactCountryFlag
                    countryCode={country.value}
                    svg
                    style={{
                      width: "1em",
                      height: "1em",
                      marginRight: "0.5em",
                    }}
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
