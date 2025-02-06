import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const vendorSchema = z.object({
  // Basic Info
  name: z.string().min(2, "Business name must be at least 2 characters"),
  type: z.enum([
    "PHOTOGRAPHER",
    "VIDEOGRAPHER",
    "STYLIST",
    "RENTAL",
    "DECOR",
    "PLANNER",
    "COOK",
    "DJ",
  ]),
  //   description: z
  //     .string()
  //     .min(50, 'Description must be at least 50 characters'),
  //   priceRange: z.enum(['BUDGET', 'MIDRANGE', 'LUXURY']),

  // Contact
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  website: z.string().url().optional(),

  // Location & Travel
  location: z.string().min(1, "Location is required"),
  travelScope: z.enum([
    "LOCAL_ONLY",
    "NATIONAL",
    "INTERNATIONAL",
    "NATIONAL_AND_INTERNATIONAL",
  ]),

  travelFee: z.number().min(0).optional(),
  servingCities: z.array(z.string()).min(1, "Add at least one serving city"),

  // Services
  services: z.array(z.string()).min(1, "Add at least one service"),
  basePrice: z.number().min(0, "Base price is required"),
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export interface VendorOnboardingStepProps {
  onNext?: () => void;
  onBack?: () => void;
  disabled?: boolean;
  form: UseFormReturn<VendorFormData>;
}
