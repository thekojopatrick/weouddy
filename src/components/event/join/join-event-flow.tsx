'use client';

import { useJoinEvent } from '@/hooks/use-join-event';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { extractIdentifierFromLink } from '@/lib/utils';
import { useState } from 'react';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import { QRScannerForm } from './forms/qr-scanner-form';
import JoinEventSuccess from './forms/success';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EventData } from '@/types/event';

interface JoinEventFlowProps {
  initialEventData?: EventData;
  onCloseDialog?: () => void;
}

export function JoinEventFlow({
  initialEventData,
  onCloseDialog,
}: JoinEventFlowProps) {
  const [currentStep, setCurrentStep] = useState<
    'LINK_PASTE' | 'QR_SCAN' | 'PIN_ENTRY'
  >('LINK_PASTE');
  const { eventQuery, joinMutation, isLoading } = useJoinEvent(
    initialEventData?.id
  );

  const handleLinkSubmit = async (link: string) => {
    const identifier = extractIdentifierFromLink(link);
    if (!identifier) return;

    const eventInfo = await eventQuery.refetch();

    if (eventInfo.data?.event?.accessType === 'PIN_REQUIRED') {
      setCurrentStep('PIN_ENTRY');
    } else {
      joinMutation.mutate({ identifier });
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (!eventQuery.data?.event?.id) return;

    joinMutation.mutate({
      identifier: eventQuery.data.event.id,
      pin,
    });
  };

  const handleQRScan = (result: string) => {
    handleLinkSubmit(result);
    setCurrentStep('LINK_PASTE');
  };

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
            Your request to join has been sent. Please wait for host
            approval.
          </AlertDescription>
        </Alert>
      );
    }

    switch (currentStep) {
      case 'LINK_PASTE':
        return (
          <LinkPasteForm
            onSubmitAction={handleLinkSubmit}
            onScanQRAction={() => setCurrentStep('QR_SCAN')}
            isLoading={isLoading}
          />
        );
      case 'QR_SCAN':
        return (
          <QRScannerForm
            onScanCompleteAction={handleQRScan}
            onBackAction={() => setCurrentStep('LINK_PASTE')}
          />
        );
      case 'PIN_ENTRY':
        return (
          <PinEntryForm
            onSubmitAction={handlePinSubmit}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {currentStep === 'PIN_ENTRY'
            ? 'Enter Event PIN'
            : joinMutation.isSuccess &&
                joinMutation.data.status === 'PENDING'
              ? 'Request Pending'
              : joinMutation.isPending
                ? undefined
                : 'Ready to join an event'}
        </DialogTitle>
      </DialogHeader>
      <div className="py-4">
        {renderContent()}
        {joinMutation.isPending && onCloseDialog && (
          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={onCloseDialog}
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
