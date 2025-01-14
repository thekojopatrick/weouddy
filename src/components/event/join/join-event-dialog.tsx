'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader } from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useJoinEvent } from '@/hooks/event/use-join-event';
import { extractIdentifierFromLink } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import { QRScannerForm } from './forms/qr-scanner-form';
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
  const { joinMutation, handlePinSubmit, isLoading } = useJoinEvent();
  const [step, setStep] = useState<'LINK' | 'PIN' | 'QR_SCAN'>(
    accessType === 'PIN_REQUIRED' ? 'PIN' : 'LINK'
  );
  const [currentIdentifier, setCurrentIdentifier] =
    useState<string>('');

  const stopCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        const stream = mediaStream;

        const tracks = stream.getTracks();

        tracks[0].stop();

        tracks.forEach((track) => {
          track.stop();
        });
      });
  };

  // Handle dialog close
  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && step === 'QR_SCAN') {
        stopCamera();
        setStep('LINK');
      }
      onOpenChangeAction(isOpen);
    },
    [step, onOpenChangeAction]
  );

  const handleJoinViaLink = useCallback(
    async (link: string) => {
      const identifier = extractIdentifierFromLink(link);
      if (!identifier) {
        toast.error('Invalid event link');
        return;
      }

      setCurrentIdentifier(identifier);

      const res = await fetch(`/api/events/${identifier}`);
      const data = await res.json();

      if (data.event?.accessType === 'PIN_REQUIRED') {
        setStep('PIN');
      } else {
        joinMutation.mutate({ identifier });
      }
    },
    [joinMutation]
  );

  const handleQRScanComplete = useCallback(
    (scannedUrl: string) => {
      handleJoinViaLink(scannedUrl);
      setStep('LINK');
    },
    [handleJoinViaLink]
  );

  const handlePinSubmitWrapper = useCallback(
    (identifier: string, pin: string) => {
      handlePinSubmit(identifier, pin);
    },
    [handlePinSubmit]
  );

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
            Request sent. Waiting for host approval.
          </AlertDescription>
        </Alert>
      );
    }

    switch (step) {
      case 'PIN':
        return (
          <PinEntryForm
            onSubmitAction={handlePinSubmitWrapper}
            isLoading={isLoading}
            eventId={
              currentIdentifier || eventId || eventSlug || null
            }
          />
        );
      case 'QR_SCAN':
        return (
          <QRScannerForm
            onScanCompleteAction={handleQRScanComplete}
            onBackAction={() => setStep('LINK')}
            isDialogOpen={open}
          />
        );
      default:
        return (
          <LinkPasteForm
            onSubmitAction={handleJoinViaLink}
            isLoading={isLoading || joinMutation.isPending}
            onScanQRAction={() => setStep('QR_SCAN')}
          />
        );
    }
  };

  return (
    <ResponsiveDialog
      open={joinMutation.isSuccess ? false : open}
      onOpenChangeAction={handleDialogClose}
      className="py-2 pb-6 border"
    >
      <DialogHeader>
        <DialogTitle className="text-sm">
          {step === 'PIN'
            ? 'Enter Event PIN'
            : step === 'QR_SCAN'
              ? 'Scan QR Code'
              : 'Join Event'}
        </DialogTitle>
      </DialogHeader>

      {renderContent()}
    </ResponsiveDialog>
  );
}

JoinEventDialog.displayName = 'JoinEventDialog';

export default JoinEventDialog;
