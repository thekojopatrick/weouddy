import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Password must contain at least one letter and one number'
    ),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  callbackUrl: z.string(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm Password'),
});

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Invalid time format'
    ),
  coverImage: z.string().min(1, 'Cover image is required'),
  isPublic: z.boolean(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordSchema
>;
export type ResetPasswordFormValues = z.infer<
  typeof resetPasswordSchema
>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const eventDetailsSchema = eventFormSchema.pick({
  name: true,
  type: true,
  description: true,
});

export const locationTimeSchema = eventFormSchema.pick({
  location: true,
  date: true,
  time: true,
});

export const privacySchema = eventFormSchema.pick({
  isPublic: true,
});
