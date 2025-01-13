'use client';

import { Button, LoadingButton } from '@/components/ui/button';
import { CopyIcon, Download, Share2 } from 'lucide-react';

import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateQRCode } from '@/lib/qr/generator';

interface SuccessStepProps {
  qrCodeUrl: string;

  eventUrl: string;
  eventName: string;
  onCloseAction: () => void;
}

export function SuccessStep({
  eventUrl,

  qrCodeUrl,
  eventName,
  onCloseAction,
}: SuccessStepProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: 'Link copied!',
        description:
          'The event link has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };
  const handleDownload = async () => {
    setIsDownloading(true);

    const qrCode = await generateQRCode(eventUrl);

    try {
      const link = document.createElement('a');
      link.href = qrCode.dataUrl;
      link.download = qrCode.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'QR Code Downloaded',
        description: 'The QR code has been saved to your device.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description:
          'Failed to download the QR code. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      // Ensure we have a valid URL
      const shareUrl = eventUrl || qrCodeUrl;

      if (navigator.share) {
        await navigator.share({
          title: `Your link to ${eventName} room`,
          text: 'Tap link or Scan this QR code to join the event',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(qrCodeUrl);
        toast({
          title: 'Link Copied',
          description: 'QR code link copied to clipboard',
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Share Failed',
          description: 'Failed to share the QR code',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold tracking-tight">
          Event successfully created
        </h2>
        <p className="text-muted-foreground text-sm">
          Your event has been created successfully! Share it with your
          friends or publish it to reach a wider audience
        </p>
      </div>

      <div className="flex justify-center py-6">
        <div className="relative h-48 w-48">
          <Image
            src={qrCodeUrl}
            alt={`${eventName}`}
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <span className="truncate flex-1 text-sm">{eventUrl}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-2">
          <Button
            className="w-full rounded-full"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Event
          </Button>
          <LoadingButton
            variant="outline"
            className="w-full rounded-full"
            loading={isDownloading}
            disabled={isDownloading}
            onClick={handleDownload}
          >
            {!isDownloading && <Download className="mr-2 h-4 w-4" />}
            {isDownloading ? 'Downloading..' : 'Download QR Code'}
          </LoadingButton>
        </div>

        <Button
          variant="ghost"
          className="w-full rounded-full"
          onClick={onCloseAction}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
