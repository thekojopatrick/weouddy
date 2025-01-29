'use client';

import { ArrowLeft, MapPin } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { toast } from 'sonner';
//import { useJsApiLoader } from '@react-google-maps/api';
//import { env } from '@/env';

interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
  subtitle?: string;
}

interface LocationModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSelectLocationAction: (location: Location) => void;
}

const predefinedLocations: Location[] = [
  {
    name: 'Accra, Ghana',
    address: 'Accra, Ghana',
    lat: 5.6037,
    lng: -0.187,
    subtitle: 'Capital City',
  },
  {
    name: 'Takoradi, Ghana',
    address: 'Takoradi, Ghana',
    lat: 4.8757,
    lng: -1.7831,
    subtitle: 'Western Region',
  },
  {
    name: 'Lagos, Nigeria',
    address: 'Lagos, Nigeria',
    lat: 6.455,
    lng: 3.394,
    subtitle: 'Commercial Capital of Nigeria',
  },
];

export function LocationModal({
  open,
  onOpenChangeAction,
  onSelectLocationAction,
}: LocationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Maps with correct libraries array
  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  //   libraries: ['places'],
  // });

  // Initialize Places Autocomplete with correct options
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'gh' }, // Restrict to Ghana
      types: ['geocode'], // Use only geocode type for consistent results
    },
    debounce: 300,
    cache: 86400,
    defaultValue: '',
    initOnMount: true,
  });

  // Reset search when modal opens
  useEffect(() => {
    if (open) {
      setValue('');
      clearSuggestions();
    }
  }, [open, setValue, clearSuggestions]);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    console.log('Input Value Changed:', newValue);
    setValue(newValue);
    if (!newValue) {
      clearSuggestions();
    }
  };

  // Handle location selection
  const handleLocationSelect = async (description: string) => {
    try {
      setIsLoading(true);
      setValue(description, false);
      clearSuggestions();

      // Check predefined locations first
      const predefinedLocation = predefinedLocations.find(
        (loc) => loc.name === description
      );

      if (predefinedLocation) {
        onSelectLocationAction(predefinedLocation);
        onOpenChangeAction(false);
        return;
      }

      // Otherwise geocode the location
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      onSelectLocationAction({
        name: description,
        address: results[0].formatted_address,
        lat,
        lng,
      });
      onOpenChangeAction(false);
    } catch (error) {
      console.error('Error selecting location:', error);
      toast.error('Error selecting location');
    } finally {
      setIsLoading(false);
    }
  };

  /*
  // Loading and error states
  if (loadError) {
    return (
      <ResponsiveDialog
        open={open}
        onOpenChangeAction={onOpenChangeAction}
      >
        <div className="p-4 text-red-500">
          Error loading Google Maps: {loadError.message}
        </div>
      </ResponsiveDialog>
    );
  }*/

  /*
  if (!isLoaded) {
    return (
      <ResponsiveDialog
        open={open}
        onOpenChangeAction={onOpenChangeAction}
      >
        <div className="flex justify-center items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ResponsiveDialog>
    );
  }
*/

  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      className="px-0"
    >
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChangeAction(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            Enter your address
          </h2>
        </div>

        <div className="px-2">
          <Command>
            <CommandInput
              placeholder="Search for a location..."
              value={value}
              onValueChange={handleInputChange}
              disabled={!ready}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? 'Searching...' : 'No results found.'}
              </CommandEmpty>
              <CommandGroup>
                {/* Show suggestions when available */}
                {status === 'OK' &&
                  data.map(({ place_id, description }) => (
                    <CommandItem
                      key={place_id}
                      value={description}
                      onSelect={(currentValue) => {
                        // If selecting the same country, reset, otherwise set new value
                        setValue(
                          currentValue === value ? '' : currentValue
                        );
                        handleLocationSelect(description);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {description}
                      </div>
                    </CommandItem>
                  ))}

                {/* Show predefined locations only when no suggestions */}
                {(!status || status !== 'OK' || data.length === 0) &&
                  predefinedLocations.map((location) => (
                    <CommandItem
                      key={location.name}
                      onSelect={() =>
                        handleLocationSelect(location.name)
                      }
                      className="flex flex-col items-start gap-1"
                    >
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.name}
                      </div>
                      {location.subtitle && (
                        <span className="ml-6 text-sm text-muted-foreground">
                          {location.subtitle}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
