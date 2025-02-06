import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { VendorOnboardingStepProps } from '../types';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const LocationStep = ({ form }: VendorOnboardingStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Location</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter primary business location"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="travelScope"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Travel Range</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select travel scope" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="LOCAL_ONLY">Local Only</SelectItem>
                <SelectItem value="NATIONAL">National</SelectItem>
                <SelectItem value="INTERNATIONAL">
                  International
                </SelectItem>
                <SelectItem value="NATIONAL_AND_INTERNATIONAL">
                  National & International
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="servingCities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Serving Cities</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter cities (comma-separated)"
                value={field.value?.join(', ') || ''}
                onChange={(e) => {
                  const cities = e.target.value
                    .split(',')
                    .map((city) => city.trim());
                  field.onChange(cities);
                }}
              />
            </FormControl>
            <FormDescription>
              Enter at least one city you serve
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="travelFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Travel Fee</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationStep;
