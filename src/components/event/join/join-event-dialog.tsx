'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader } from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useJoinEvent } from '@/hooks/use-join-event';
import { extractIdentifierFromLink } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import JoinEventSuccess from './forms/success';
import { JoinStep } from '@/types/event';

export type JoinEventAccessType = 'LINK_ONLY' | 'PIN_REQUIRED';
interface JoinEventDialogProps {
  eventId?: string;
  eventSlug?: string;
  accessType?: JoinEventAccessType;
  requiresApproval?: boolean;
  initialStep?: JoinStep;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function JoinEventDialog({
  open,
  onOpenChangeAction,
  eventId,
  accessType = 'LINK_ONLY',
  eventSlug,
}: JoinEventDialogProps) {
  const { eventQuery, joinMutation, isLoading } = useJoinEvent(
    eventId ?? eventSlug
  );
  const [step, setStep] = useState<'LINK' | 'PIN' | 'QR_SCAN'>(
    accessType === 'PIN_REQUIRED' ? 'PIN' : 'LINK'
  );

  const handleJoin = async (link: string) => {
    const identifier = extractIdentifierFromLink(link);
    if (!identifier) {
      toast.error('Error', { description: 'Invalid event link' });
      return;
    }

    const eventInfo = await eventQuery.refetch();
    if (eventInfo.data?.event?.accessType === 'PIN_REQUIRED') {
      setStep('PIN');
    } else {
      joinMutation.mutate({ identifier });
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (eventQuery.data?.event?.id) {
      joinMutation.mutate({
        identifier: eventQuery.data.event.id,
        pin,
      });
    }
  };

  const handleQRScan = () => {
    // Implement QR scanning logic
    setStep('QR_SCAN');
    console.log('QR scan triggered');
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
    >
      <DialogHeader>
        <DialogTitle>
          {step === 'PIN' ? 'Enter Event PIN' : 'Join Event'}
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
      ) : step === 'PIN' ? (
        <PinEntryForm
          onSubmitAction={handlePinSubmit}
          isLoading={isLoading}
        />
      ) : (
        <LinkPasteForm
          onSubmitAction={handleJoin}
          isLoading={isLoading}
          onScanQRAction={handleQRScan}
        />
      )}
    </ResponsiveDialog>
  );
}

JoinEventDialog.displayName = 'JoinEventDialog';

export default JoinEventDialog;
