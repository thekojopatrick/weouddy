'use client';

import { EventFormValues, eventFormSchema } from '@/types/validation';

import { CoverUploadStep } from './steps/cover-upload';
import { EventDetailsStep } from './steps/event-details';
import { Form } from '@/components/ui/form';
import { LocationTimeStep } from './steps/location-time-step';
import { PrivacyStep } from './steps/privacy';
import { SuccessStep } from './steps/success';
import { WelcomeStep } from './steps/welcome';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

interface CreateEventFormProps {
	onCloseAction: () => void;
}

type Step =
	| 'welcome'
	| 'details'
	| 'location'
	| 'cover'
	| 'privacy'
	| 'success';

export function CreateEventForm({ onCloseAction }: CreateEventFormProps) {
	const [step, setStep] = useState<Step>('welcome');
	const [eventUrl, setEventUrl] = useState('');

	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			title: '',
			type: '',
			description: '',
			location: '',
			date: '',
			time: '',
			isPublic: false,
		},
	});

	const onSubmit = async (data: EventFormValues) => {
		try {
			// Validate the entire form data
			const result = eventFormSchema.safeParse(data);

			if (!result.success) {
				// Log detailed validation errors
				console.error('Validation Errors:', result.error.flatten());
				return;
			}

			// Proceed with form submission
			console.log(data);
			setEventUrl('weoudy.com/lisley?event=birthday-party');
			setStep('success');
		} catch (error) {
			console.error('Submission Error:', error);
		}
	};

	const handleStepSubmit = async (nextStep: Step) => {
		let isValid = false;
		switch (step) {
			case 'details':
				isValid = await form.trigger(['title', 'type', 'description']);
				break;
			case 'location':
				isValid = await form.trigger(['location', 'date', 'time']);
				break;
			case 'privacy':
				isValid = await form.trigger(['isPublic']);
				break;
			default:
				isValid = true;
		}

		if (isValid) {
			setStep(nextStep);
		}
	};

	return (
		<div className='max-w-2xl mx-auto z-40'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{step === 'welcome' && (
						<WelcomeStep
							onNext={() => setStep('details')}
							onSkip={onCloseAction}
						/>
					)}
					{step === 'details' && (
						<EventDetailsStep
							form={form}
							onSubmit={() => handleStepSubmit('location')}
							onBack={() => setStep('welcome')}
						/>
					)}
					{step === 'location' && (
						<LocationTimeStep
							form={form}
							onNext={() => setStep('cover')}
							onBack={() => setStep('details')}
						/>
					)}
					{step === 'cover' && (
						<CoverUploadStep
							form={form}
							onNext={() => setStep('privacy')}
							onBack={() => setStep('location')}
						/>
					)}
					{step === 'privacy' && (
						<PrivacyStep
							form={form}
							onSubmit={onSubmit}
							onBack={() => setStep('cover')}
						/>
					)}
					{step === 'success' && (
						<SuccessStep eventUrl={eventUrl} onClose={onCloseAction} />
					)}
				</form>
			</Form>
		</div>
	);
}
