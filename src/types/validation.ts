import { z } from 'zod';

export const authSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const signUpSchema = z.object({
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

export const eventFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	type: z.string().min(1, 'Event type is required'),
	description: z.string().min(1, 'Description is required'),
	// Additional fields will be added in subsequent steps
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
