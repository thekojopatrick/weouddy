'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useJoinEvent } from '@/hooks/event/use-join-event';
import { PinEntryForm } from './forms/pin-entry-form';
import JoinEventSuccess from './forms/success';

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string; // Now required since we're only handling card selection
  accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
  requiresApproval?: boolean;
}

export function JoinEventDialogViaEventCard({
  open,
  onOpenChange,
  eventId,
  accessType,
  requiresApproval,
}: JoinEventDialogProps) {
  const { joinMutation } = useJoinEvent();

  // Handle PIN submission
  const handlePinSubmit = (pin: string) => {
    if (eventId && !joinMutation.isPending) {
      joinMutation.mutate({ identifier: eventId, pin });
    }
  };

  // Determine what content to show based on the current state
  const renderContent = () => {
    if (joinMutation.isPending) {
      return <JoinEventSuccess isLoading={true} />;
    }

    if (
      joinMutation.isSuccess &&
      joinMutation.data.status === 'PENDING'
    ) {
      return (
        <Alert>
          <AlertDescription>
            {requiresApproval
              ? 'Request sent. Waiting for host approval.'
              : 'Joining event...'}
          </AlertDescription>
        </Alert>
      );
    }

    if (accessType === 'PIN_REQUIRED') {
      return (
        <PinEntryForm
          onSubmitAction={handlePinSubmit}
          isLoading={joinMutation.isPending}
        />
      );
    }

    return null;
  };

  return (
    <ResponsiveDialog open={open} onOpenChangeAction={onOpenChange}>
      <DialogHeader>
        <DialogTitle>
          {accessType === 'PIN_REQUIRED'
            ? 'Enter Event PIN'
            : 'Join Event'}
        </DialogTitle>
      </DialogHeader>

      {renderContent()}
    </ResponsiveDialog>
  );
}
