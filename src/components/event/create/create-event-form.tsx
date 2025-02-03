'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  eventFormSchema,
  type EventFormValues,
} from '@/types/validation';
import { Form } from '@/components/ui/form';
import { CoverUploadStep } from './steps/cover-upload';
import { EventDetailsStep } from './steps/event-details';
import { LocationTimeStep } from './steps/location-time-step';
import { PrivacyStep } from './steps/privacy';
import { WelcomeStep } from './steps/welcome';

interface CreateEventFormProps {
  onCloseAction: () => void;
  onSubmit: (data: EventFormValues) => Promise<void>;
  disabled?: boolean;
}

type Step = 'welcome' | 'details' | 'location' | 'cover' | 'privacy';

const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const DEFAULT_VALUES: EventFormValues = {
  name: '',
  type: '', // Provide a default value for type
  description: '',
  location: '',
  date: new Date().toISOString().split('T')[0], // Default to today's date
  time: new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }), // Default current time
  coverImage: '',
  isPublic: false,
  requiresApproval: false,
};

export function CreateEventForm({
  onCloseAction,
  onSubmit,
  disabled = false, // Ensure disabled has a default value
}: CreateEventFormProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const validateCoverImage = (imageData: string) => {
    if (!imageData) return; // Skip validation if no image

    if (!imageData.startsWith('data:image')) {
      throw new Error('Invalid image format');
    }

    const base64Data = imageData.split(',')[1];
    const sizeInBytes = Buffer.from(base64Data, 'base64').length;
    if (sizeInBytes > MAX_COVER_IMAGE_SIZE) {
      throw new Error('Cover image must be less than 5MB');
    }
  };

  const handleSubmit = async (data: EventFormValues) => {
    try {
      validateCoverImage(data.coverImage);
      await onSubmit(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  const handleStepChange = async (nextStep: Step) => {
    setError(null);

    const fieldsToValidate = {
      details: ['name', 'type', 'description'],
      location: ['location', 'date', 'time'],
      cover: ['coverImage'],
      privacy: ['isPublic'],
      welcome: [],
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

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
              disabled={disabled}
            />
          )}

          {step === 'location' && (
            <LocationTimeStep
              onNext={() => handleStepChange('cover')}
              onBack={() => setStep('details')}
              disabled={disabled}
              form={form}
            />
          )}

          {step === 'cover' && (
            <CoverUploadStep
              onNext={() => handleStepChange('privacy')}
              onBack={() => setStep('location')}
              maxSize={MAX_COVER_IMAGE_SIZE}
              onError={(error) => setError(error)}
              disabled={disabled}
            />
          )}

          {step === 'privacy' && (
            <PrivacyStep
              onSubmit={form.handleSubmit(handleSubmit)}
              onBack={() => setStep('cover')}
              isSubmitting={disabled}
              error={error}
            />
          )}
        </form>
      </Form>
    </div>
  );
}
