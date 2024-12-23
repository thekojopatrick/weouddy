'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	MotionDialog,
} from '@/components/ui/custom-motion-dialog';
import React, { useActionState } from 'react';

import { LoadingButton } from '../ui/button';
import { submitWaitlistForm } from '@/server/actions/forms/waitlist';
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
			className='self-end dark:bg-white dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed'
			disabled={pending}
			loading={pending}
		>
			{pending ? 'Joining...' : 'Join now'}
		</LoadingButton>
	);
}

export function JoinWaitList() {
	const [state, formAction] = useActionState<FormState, FormData>(
		submitWaitlistForm,
		initialState
	);

	return (
		<MotionDialog>
			<DialogTrigger className='dark:bg-zinc-950 px-4 py-2 text-sm font-semibold dark:text-white dark:hover:bg-zinc-900 bg-white text-zinc-900 hover:bg-zinc-100 rounded-full'>
				Join waitlist
			</DialogTrigger>
			<DialogContent className='w-full max-w-md bg-white p-6 dark:bg-zinc-900'>
				<DialogHeader>
					<DialogTitle className='text-zinc-900 dark:text-white'>
						Join the waitlist
					</DialogTitle>
					<DialogDescription className='text-zinc-600 dark:text-zinc-400'>
						Enter your email address to receive updates when we launch.
					</DialogDescription>
				</DialogHeader>
				<form action={formAction} className='mt-6 flex flex-col space-y-4'>
					{state.message && !state.success && (
						<Alert
							variant='destructive'
							className='bg-red-50 dark:bg-red-900/20'
						>
							<AlertDescription className='text-red-800 dark:text-red-200'>
								{state.message}
							</AlertDescription>
						</Alert>
					)}
					{state.success && (
						<Alert className='bg-green-50 dark:bg-green-900/20'>
							<AlertDescription className='text-green-800 dark:text-green-200'>
								Thanks for joining! We&apos;ll keep you updated.
							</AlertDescription>
						</Alert>
					)}
					<label htmlFor='email' className='sr-only'>
						Email
					</label>
					<input
						id='email'
						name='email'
						type='email'
						className='h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-none focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm'
						placeholder='Enter your email'
						required
					/>
					<SubmitButton />
				</form>
				<DialogClose />
			</DialogContent>
		</MotionDialog>
	);
}

export default JoinWaitList;
