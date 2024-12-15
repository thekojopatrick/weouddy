'use client';

import { EventFormValues, eventFormSchema } from '@/types/validation';

import { CoverUploadStep } from './steps/cover-upload';
import { EventDetailsStep } from './steps/event-details';
import { LocationTimeStep } from './steps/location-time-step';
import { PrivacyStep } from './steps/privacy';
import { SuccessStep } from './steps/success';
import { WelcomeStep } from './steps/welcome';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

interface CreateEventFormProps {
	onClose: () => void;
}

type Step =
	| 'welcome'
	| 'details'
	| 'location'
	| 'cover'
	| 'privacy'
	| 'success';

export function CreateEventForm({ onClose }: CreateEventFormProps) {
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
		// Handle form submission
		console.log(data);
		// Generate event URL (this would normally come from your backend)
		setEventUrl('weoudy.com/lisley?event=birthday-party');
		setStep('success');
	};

	return (
		<div className='max-w-2xl mx-auto'>
			{step === 'welcome' && (
				<WelcomeStep onNext={() => setStep('details')} onSkip={onClose} />
			)}
			{step === 'details' && (
				<EventDetailsStep
					form={form}
					onSubmit={() => setStep('location')}
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
				<SuccessStep eventUrl={eventUrl} onClose={onClose} />
			)}
		</div>
	);
}
