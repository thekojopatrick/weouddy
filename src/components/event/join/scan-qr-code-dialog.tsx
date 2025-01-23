'use client';

import { DialogHeader } from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { useCallback } from 'react';
import { QRScannerForm } from './forms/qr-scanner-form';
import { JoinStep } from '@/types/event';

export type JoinEventAccessType = 'DIRECT_PASS' | 'PIN_REQUIRED';
interface JoinEventDialogProps {
  eventId?: string;
  eventSlug?: string;
  accessType?: JoinEventAccessType;
  requiresApproval?: boolean;
  initialStep?: JoinStep;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function ScanQRCodeDialog({
  open,
  onOpenChangeAction,
}: JoinEventDialogProps) {
  const stopCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        const tracks = mediaStream.getTracks();
        tracks.forEach((track) => track.stop());
      });
  };

  // Handle dialog close
  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        stopCamera();
      }
      onOpenChangeAction(isOpen);
    },
    [onOpenChangeAction]
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={handleDialogClose}
      className="py-2 pb-6 border"
    >
      <DialogHeader>
        <DialogTitle className="text-sm">
          Scan Event QR Code
        </DialogTitle>
      </DialogHeader>
      <QRScannerForm
        onScanCompleteAction={() => {}} // This will be handled by the join mechanism
        onBackAction={() => onOpenChangeAction(false)}
        isDialogOpen={open}
      />
    </ResponsiveDialog>
  );
}

export default ScanQRCodeDialog;
