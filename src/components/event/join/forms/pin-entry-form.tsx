'use client';

import { LoadingButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface PinEntryFormProps {
  onSubmitAction: (identifier: string, pin: string) => void;
  isLoading?: boolean;
  eventId: string | null;
}

export function PinEntryForm({
  onSubmitAction,
  isLoading,
  eventId,
}: PinEntryFormProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const validateAndSubmit = () => {
    if (!eventId) {
      toast.error('Error', { description: 'Invalid event id' });
      return;
    }

    // Reset error state
    setError('');

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    onSubmitAction(eventId, pin);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin" className="text-base">
          Event Access PIN
        </Label>
        <Input
          id="pin"
          type="text"
          placeholder="Enter 6-digit event PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/[^0-9]/g, ''));
            setError(''); // Clear error on input change
          }}
          maxLength={6}
          className={
            error ? 'border-red-500' : 'shadow-none text-sm h-12'
          }
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Ask the event host for the access PIN
        </p>
      </div>
      <LoadingButton
        className="w-full"
        onClick={validateAndSubmit}
        disabled={!pin || isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Validating...' : 'Verify Access'}
      </LoadingButton>
    </div>
  );
}
