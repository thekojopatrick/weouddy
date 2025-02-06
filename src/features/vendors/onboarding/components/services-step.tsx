import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { VendorOnboardingStepProps } from "../types";

const ServicesStep = ({ form }: VendorOnboardingStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="services"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Services</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter services (comma-separated)"
                value={field.value?.join(", ") || ""}
                onChange={(e) => {
                  const services = e.target.value
                    .split(",")
                    .map((service) => service.trim());
                  field.onChange(services);
                }}
              />
            </FormControl>
            <FormDescription>
              Enter at least one service you provide
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="basePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter base price"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServicesStep;
