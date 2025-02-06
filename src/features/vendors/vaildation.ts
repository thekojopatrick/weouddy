import { z } from "zod";

export const contactFormSchema = z.object({
  details: z.string().min(50, "Please provide more details about your event"),
  targetDate: z.string().min(1, "Please select a target date"),
  budget: z.number().min(350, "Minimum budget is $350"),
  guestCount: z.number().optional(),
  specialRequirements: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
