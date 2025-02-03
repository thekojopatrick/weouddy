'use client';

import { useEffect, useState } from 'react';
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
import { useCreateEventStore } from '@/stores/use-create-event-store'; // Import the new store

interface CreateEventFormProps {
  onCloseAction: () => void;
  onSubmit: (data: EventFormValues) => Promise<void>;
  disabled?: boolean;
}

type Step = 'welcome' | 'details' | 'location' | 'cover' | 'privacy';

const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const DEFAULT_VALUES: EventFormValues = {
  name: '',
  type: '',
  description: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }),
  coverImage: '',
  isPublic: false,
  requiresApproval: false,
};

export function CreateEventForm({
  onCloseAction,
  onSubmit,
  disabled = false,
}: CreateEventFormProps) {
  // Use the Zustand store
  const {
    formData,
    currentStep: storedStep,
    updateFormData,
    updateStep,
    resetStore,
  } = useCreateEventStore();

  const [step, setStep] = useState<Step>(
    (storedStep as Step) || 'welcome'
  );
  const [error, setError] = useState<string | null>(null);

  // Merge stored form data with default values
  const mergedDefaultValues = { ...DEFAULT_VALUES, ...formData };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: mergedDefaultValues,
    mode: 'onChange',
  });

  // Sync form changes with store
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Only update non-empty values
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, v]) => v !== undefined && v !== ''
        )
      );
      updateFormData(filteredValues);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  const validateCoverImage = (imageData: string) => {
    if (!imageData) return;

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
      // Reset store after successful submission
      resetStore();
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

      // Update both local and store step
      setStep(nextStep);
      updateStep(nextStep);
    } catch (error) {
      console.error('Step change error:', error);
      setError('Failed to proceed to next step');
    }
  };

  // Handle closing the form
  const handleCloseAction = () => {
    onCloseAction();
    // Optionally, you might want to keep the data or reset based on requirements
    resetStore(); // Uncomment if you want to clear data on close
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {step === 'welcome' && (
            <WelcomeStep
              onNext={() => setStep('details')}
              onSkip={handleCloseAction}
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
