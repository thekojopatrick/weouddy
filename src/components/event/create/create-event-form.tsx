'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues } from '@/types/validation';
import { Form } from '@/components/ui/form';
import { createEvent } from '@/app/actions/create-event';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { QRCodeType } from '@/lib/qr/types';

import { LocationTimeStep } from './steps/location-time-step';
import { PrivacyStep } from './steps/privacy';
import { SuccessStep } from './steps/success';
import { WelcomeStep } from './steps/welcome';
import { CoverUploadStep } from './steps/cover-upload';
import { EventDetailsStep } from './steps/event-details';

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

const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface EventCreationResult {
	eventUrl: string;
	qrCode: QRCodeType;
	qrCodeUrl: string;
	eventName: string;
}

export function CreateEventForm({ onCloseAction }: CreateEventFormProps) {
	const [step, setStep] = useState<Step>('welcome');
	const [eventData, setEventData] = useState<EventCreationResult | null>(null);
	const [error, setError] = useState<string | null>(null);
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

	const validateCoverImage = (imageData: string) => {
		if (!imageData.startsWith('data:image')) {
			throw new Error('Invalid image format');
		}

		const base64Data = imageData.split(',')[1];
		const sizeInBytes = Buffer.from(base64Data, 'base64').length;
		if (sizeInBytes > MAX_COVER_IMAGE_SIZE) {
			throw new Error('Cover image must be less than 800KB');
		}
	};

	const onSubmit = async (data: EventFormValues) => {
		setIsSubmitting(true);
		setError(null);

		try {
			if (data.coverImage) {
				validateCoverImage(data.coverImage);
			}

			const event = await createEvent(data);

			if (event) {
				toast({
					title: 'Event created!',
					description: 'Your event room has been created successfully.',
				});

				setEventData({
					eventUrl: `${window.location.origin}/events/${event.slug}`,
					qrCodeUrl: event.qrCodeUrl!,
					qrCode: event.qrCode!,
					eventName: event.name,
				});
				setStep('success');
			} else {
				setError('Failed to create event. Please try again.');
			}
		} catch (error) {
			console.error('Event creation error:', error);

			const errorMessage =
				error instanceof Error ? error.message : 'An unexpected error occurred';

			if (errorMessage.includes('Please wait')) {
				setError('Please wait a moment before creating another event');
			} else if (errorMessage.includes('Cover image')) {
				setError('Cover image error: ' + errorMessage);
				form.setValue('coverImage', '');
			} else {
				setError(`Failed to create event: ${errorMessage}`);
			}

			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStepChange = async (nextStep: Step) => {
		setError(null);

		const fieldsToValidate = {
			details: ['title', 'type', 'description'],
			location: ['location', 'date', 'time'],
			cover: ['coverImage'],
			privacy: ['isPublic'],
			welcome: [],
			success: [],
		}[step] as (keyof EventFormValues)[];

		try {
			if (fieldsToValidate.length > 0) {
				const isValid = await form.trigger(fieldsToValidate);
				if (!isValid) {
					setError('Please fill in all required fields correctly');
					return;
				}
			}

			setStep(nextStep);
		} catch (error) {
			console.error('Step change error:', error);
			setError('Failed to proceed to next step');
		}
	};

	// Render success step outside of form if event creation is complete
	if (step === 'success' && eventData) {
		return (
			<SuccessStep
				eventUrl={eventData.eventUrl}
				qrCode={eventData.qrCode}
				qrCodeUrl={eventData.qrCodeUrl}
				eventName={eventData.eventName}
				onCloseAction={onCloseAction}
			/>
		);
	}

	return (
		<div className='max-w-2xl mx-auto'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{isSubmitting && (
						<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
							<div className='bg-white p-4 rounded-lg flex items-center gap-2'>
								<Loader2 className='h-6 w-6 animate-spin' />
								<span>Creating your event...</span>
							</div>
						</div>
					)}

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
							maxSize={MAX_COVER_IMAGE_SIZE}
							onError={(error) => setError(error)}
						/>
					)}

					{step === 'privacy' && (
						<PrivacyStep
							onSubmit={form.handleSubmit(onSubmit)}
							onBack={() => setStep('cover')}
							isSubmitting={isSubmitting}
							error={error}
						/>
					)}
				</form>
			</Form>
		</div>
	);
}
