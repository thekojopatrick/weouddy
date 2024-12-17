'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues } from '@/types/validation';
import { Form } from '@/components/ui/form';
import { createEvent } from '@/app/actions/create-event';
import { useToast } from '@/hooks/use-toast';

import { LocationTimeStep } from './steps/location-time-step';
import { PrivacyStep } from './steps/privacy';
import { SuccessStep } from './steps/success';
import { WelcomeStep } from './steps/welcome';
import { CoverUploadStep } from './steps/cover-upload';
import { EventDetailsStep } from './steps/event-details';
import { QRCodeType } from '@/lib/qr/types';

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
	const [eventName, setEventName] = useState('');
	const [qrCode, setQrCode] = useState<QRCodeType>();
	const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			title: '',
			type: '',
			description: '',
			location: '',
			date: '',
			time: '',
			coverImage: '',
			isPublic: false,
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: EventFormValues) => {
		setIsSubmitting(true);
		try {
			const event = await createEvent(data);

			console.log('Event creation response:', { event });

			if (event) {
				toast({
					title: 'Event created!',
					description: 'Your event room has been created successfully.',
				});

				// Generate the event URL using the returned event data
				setEventUrl(`${window.location.origin}/events/${event.slug}`);
				setQrCodeUrl(event.qrCodeUrl);
				setQrCode(event.qrCode);
				setEventName(event.name);
				setStep('success');
			} else {
				// Add a specific toast for when event is null
				toast({
					title: 'Error',
					description: 'Event creation returned no data. Please try again.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			// More detailed error logging and toasting
			console.error('Full error during event creation:', error);
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to create event. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStepChange = async (nextStep: Step) => {
		const fieldsToValidate = {
			details: ['title', 'type', 'description'],
			location: ['location', 'date', 'time'],
			cover: ['coverImage'],
			privacy: ['isPublic'],
			welcome: [],
			success: [],
		}[step] as (keyof EventFormValues)[];

		if (fieldsToValidate.length > 0) {
			const isValid = await form.trigger(fieldsToValidate);
			if (!isValid) return;
		}

		setStep(nextStep);
	};

	return (
		<div className='max-w-2xl mx-auto'>
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
							onNext={() => handleStepChange('location')}
							onBack={() => setStep('welcome')}
						/>
					)}
					{step === 'location' && (
						<LocationTimeStep
							onNextAction={() => handleStepChange('cover')}
							onBackAction={() => setStep('details')}
						/>
					)}
					{step === 'cover' && (
						<CoverUploadStep
							onNextAction={() => handleStepChange('privacy')}
							onBackAction={() => setStep('location')}
						/>
					)}
					{step === 'privacy' && (
						<PrivacyStep
							onSubmit={form.handleSubmit(onSubmit)}
							onBack={() => setStep('cover')}
							isSubmitting={isSubmitting}
						/>
					)}
					{step === 'success' && (
						<SuccessStep
							eventUrl={eventUrl}
							qrCode={qrCode!}
							qrCodeUrl={qrCodeUrl}
							eventName={eventName}
							onCloseAction={onCloseAction}
						/>
					)}
				</form>
			</Form>
		</div>
	);
}
