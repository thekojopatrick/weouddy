'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import React, { useActionState } from 'react';

import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/button';
import { submitContactForm } from '@/server/actions/forms/submit-contact';
import { useFormStatus } from 'react-dom';

type FormState = {
	message: string;
	success: boolean;
};

const initialState: FormState = {
	message: '',
	success: false,
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<LoadingButton
			type='submit'
			disabled={pending}
			className='w-full bg-black text-white hover:bg-black/90'
			loading={pending}
		>
			{pending ? 'Submitting...' : 'Submit'}
		</LoadingButton>
	);
}

export function ContactForm() {
	const [state, formAction] = useActionState<FormState, FormData>(
		submitContactForm,
		initialState
	);

	return (
		<div className='w-full max-w-2xl mx-auto p-6'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Contact us</h1>
			</div>

			<form action={formAction} className='space-y-6'>
				{state.message && !state.success && (
					<Alert variant='destructive'>
						<AlertDescription>{state.message}</AlertDescription>
					</Alert>
				)}

				{state.success && (
					<Alert className='bg-green-50 dark:bg-green-900/20'>
						<AlertDescription className='text-green-800 dark:text-green-200'>
							Thank you for contacting us! We&apos;ll get back to you soon.
						</AlertDescription>
					</Alert>
				)}

				<div className='space-y-2'>
					<Label htmlFor='name'>
						Name<span className='text-red-500'>*</span>
					</Label>
					<input
						id='name'
						name='name'
						type='text'
						required
						className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
						placeholder='Your name'
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>
							Email<span className='text-red-500'>*</span>
						</Label>
						<input
							id='email'
							name='email'
							type='email'
							required
							className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
							placeholder='you@example.com'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='phone'>Phone</Label>
						<input
							id='phone'
							name='phone'
							type='tel'
							className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
							placeholder='Your phone number'
						/>
					</div>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='subject'>
						Subject<span className='text-red-500'>*</span>
					</Label>
					<input
						id='subject'
						name='subject'
						type='text'
						required
						className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
						placeholder='What is this about?'
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='message'>Message</Label>
					<textarea
						id='message'
						name='message'
						rows={5}
						className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
						placeholder='How can we help?'
					/>
				</div>

				<SubmitButton />
			</form>
		</div>
	);
}
