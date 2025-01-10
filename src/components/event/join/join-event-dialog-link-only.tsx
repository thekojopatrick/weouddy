'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useJoinEvent } from '@/hooks/use-join-event';
import { useEffect } from 'react';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import JoinEventSuccess from './forms/success';

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string;
  eventSlug?: string;
  accessType?: 'LINK_ONLY' | 'PIN_REQUIRED';
  requiresApproval?: boolean;
}

export function JoinEventDialogLinkOnly({
  open,
  onOpenChange,
  eventId,
  accessType = 'LINK_ONLY',
}: JoinEventDialogProps) {
  const { joinMutation, isLoading } = useJoinEvent(eventId);

  useEffect(() => {
    if (open && eventId) {
      joinMutation.mutate({ identifier: eventId });
    }
  }, [eventId, open, joinMutation]);

  const handleJoin = async (link: string) => {
    joinMutation.mutate({ identifier: eventId || link });
  };

  const handlePinSubmit = (pin: string) => {
    if (eventId) {
      joinMutation.mutate({ identifier: eventId, pin });
    }
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

      {joinMutation.isPending ? (
        <JoinEventSuccess isLoading={true} />
      ) : joinMutation.isSuccess &&
        joinMutation.data.status === 'PENDING' ? (
        <Alert>
          <AlertDescription>
            Request sent. Waiting for host approval.
          </AlertDescription>
        </Alert>
      ) : accessType === 'PIN_REQUIRED' ? (
        <PinEntryForm
          onSubmitAction={handlePinSubmit}
          isLoading={isLoading}
        />
      ) : (
        <LinkPasteForm
          onSubmitAction={handleJoin}
          onScanQRAction={() => {}}
          isLoading={isLoading}
        />
      )}
    </ResponsiveDialog>
  );
}
