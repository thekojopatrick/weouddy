'use client';

import { LinkIcon } from 'lucide-react';

import { LoadingButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface LinkPasteFormProps {
  onSubmitAction: (link: string) => void;
  onScanQRAction: () => void;
  isLoading?: boolean;
}

export function LinkPasteForm({
  onSubmitAction,
  onScanQRAction,
  isLoading,
}: LinkPasteFormProps) {
  const [link, setLink] = useState('');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="event-link font-medium">Paste Link</Label>
        <div className="relative">
          <Input
            id="event-link"
            type="text"
            placeholder="weouddy.com/events/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="pr-24 shadow-sm"
          />
          <LoadingButton
            size="sm"
            className="absolute right-[.12rem] top-[.1rem]"
            onClick={() => onSubmitAction(link)}
            disabled={!link || isLoading}
            loading={isLoading}
          >
            {isLoading ? (
              <span>Joining...</span>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                Join
              </>
            )}
          </LoadingButton>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or
          </span>
        </div>
      </div>

      <LoadingButton
        variant="outline"
        className="w-full shadow-sm"
        onClick={onScanQRAction}
        disabled={isLoading}
        loading={isLoading}
      >
        Scan QR Code
      </LoadingButton>
    </div>
  );
}
