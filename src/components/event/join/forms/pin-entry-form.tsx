'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractIdentifierFromLink } from '@/lib/utils';
import { link } from 'fs';
import { Loader2 } from 'lucide-react';
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
        <Label htmlFor="pin">Enter Event PIN</Label>
        <Input
          id="pin"
          type="text"
          placeholder="Enter the 6-digit PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/[^0-9]/g, ''));
            setError(''); // Clear error on input change
          }}
          maxLength={6}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button
        className="w-full"
        onClick={validateAndSubmit}
        disabled={!pin || isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
}
