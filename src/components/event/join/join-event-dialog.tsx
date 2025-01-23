'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { useJoinEvent } from '@/hooks/event/use-join-event';
import { PinEntryForm } from './forms/pin-entry-form';
import JoinEventSuccess from './forms/success';
import { useCallback, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
  requiresApproval?: boolean;
}

export function JoinEventDialog({
  open,
  onOpenChange,
  eventId,
  accessType,
  requiresApproval,
}: JoinEventDialogProps) {
  const {
    joinMutation,
    handlePinSubmit,
    handleJoinViaCard,
    isLoading,
  } = useJoinEvent();

  // Handle PIN submission
  const handlePinSubmitWrapper = useCallback(
    (identifier: string, pin: string) => {
      handlePinSubmit(identifier, pin);
    },
    [handlePinSubmit]
  );

  // Automatically trigger join for LINK_ONLY events
  useEffect(() => {
    if (
      open &&
      accessType === 'LINK_ONLY' &&
      !joinMutation.isPending
    ) {
      handleJoinViaCard(eventId);
    }
  }, [
    open,
    accessType,
    eventId,
    handleJoinViaCard,
    joinMutation.isPending,
  ]);

  // Determine what content to show based on the current state
  const renderContent = () => {
    if (joinMutation.isPending) {
      return <JoinEventSuccess isLoading={true} />;
    }

    if (joinMutation.isSuccess) {
      if (joinMutation.data.status === 'PENDING') {
        return (
          <Alert>
            <AlertDescription>
              Request sent. Waiting for host approval.
            </AlertDescription>
          </Alert>
        );
      }
      return <JoinEventSuccess isLoading={false} />;
    }

    if (accessType === 'PIN_REQUIRED') {
      return (
        <PinEntryForm
          onSubmitAction={handlePinSubmitWrapper}
          isLoading={isLoading}
          eventId={eventId}
        />
      );
    }

    return (
      <Alert>
        <AlertDescription>
          Processing your request to join...
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="py-3 px-4">
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle className="text-sm">
            {accessType === 'PIN_REQUIRED'
              ? 'Enter Event PIN'
              : requiresApproval
                ? 'Requesting to Join'
                : 'Joining Event'}
          </AlertDialogTitle>
        </AlertDialogHeader>
        {renderContent()}
      </AlertDialogContent>
    </AlertDialog>
  );
}
