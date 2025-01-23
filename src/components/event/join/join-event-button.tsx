'use client';

import { Button } from '@/components/ui/button';
import ScanQRCodeDialog from './scan-qr-code-dialog';
import { ScanQrCode } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function JoinEventButton({
  isSmallDevice,
  user,
}: {
  isSmallDevice: boolean;
  user: User;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    if (!user) return null;
    setShowDialog(true);
  };

  return (
    <>
      <Button
        variant={'outline'}
        size={isSmallDevice ? 'icon' : 'lg'}
        className={cn(
          'rounded-full shadow-lg',
          isSmallDevice ? 'size-12' : 'h-12'
        )}
        onClick={handleClick}
      >
        {isSmallDevice ? (
          <ScanQrCode className={'size-6'} />
        ) : (
          <ScanQrCode className={'size-6'} />
        )}
        <span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
          Scan QR
        </span>
      </Button>

      <ScanQRCodeDialog
        open={showDialog}
        onOpenChangeAction={setShowDialog}
      />
    </>
  );
}
