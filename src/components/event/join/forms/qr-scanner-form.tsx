'use client';

import { ArrowLeft, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractIdentifierFromLink } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerFormProps {
  onScanCompleteAction: (result: string) => void;
  onBackAction: () => void;
  isDialogOpen: boolean;
}

export function QRScannerForm({
  onScanCompleteAction,
  onBackAction,
  isDialogOpen,
}: QRScannerFormProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  // Cleanup function for camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // Handle dialog close
  useEffect(() => {
    if (!isDialogOpen) {
      stopCamera();
    }
    // Cleanup when component unmounts
    return () => {
      stopCamera();
    };
  }, [isDialogOpen]);

  const startScanning = async () => {
    try {
      setIsScanning(true);

      // Check if the browser supports the BarcodeDetector API
      if ('BarcodeDetector' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code'],
        });

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          {
            video: { facingMode: 'environment' },
          }
        );
        setStream(mediaStream);

        const video = document.getElementById(
          'qr-video'
        ) as HTMLVideoElement;
        if (!video) {
          throw new Error('Video element not found');
        }

        video.srcObject = mediaStream;
        await video.play();

        const checkForQRCode = async () => {
          if (!isScanning) return;

          try {
            const codes = await barcodeDetector.detect(video);
            if (codes.length > 0) {
              const url = codes[0].rawValue;
              stopCamera();

              try {
                console.log({ url });
                const eventId = extractIdentifierFromLink(url);
                onScanCompleteAction(
                  `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`
                );
              } catch (error) {
                toast({
                  title: 'Invalid QR Code',
                  description:
                    error instanceof Error
                      ? error.message
                      : 'The scanned QR code is not a valid event link.',
                  variant: 'destructive',
                });
              }
            } else if (isScanning) {
              requestAnimationFrame(checkForQRCode);
            }
          } catch (error) {
            console.error('Error detecting QR code:', error);
          }
        };

        checkForQRCode();
      } else {
        toast({
          title: 'Not Supported',
          description:
            'QR code scanning is not supported in your browser.',
          variant: 'destructive',
        });
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description:
          'Unable to access your camera. Please check permissions.',
        variant: 'destructive',
      });
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
        {isScanning ? (
          <div className="space-y-4">
            <video
              id="qr-video"
              className="w-full aspect-square rounded-lg bg-black"
              autoPlay
              playsInline
            />
          </div>
        ) : (
          <Button onClick={startScanning}>
            <QrCode className="mr-2 h-4 w-4" />
            {isScanning ? 'Scanning...' : 'Start Scanning'}
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          stopCamera();
          onBackAction();
        }}
        className="mb-2 w-full rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
    </div>
  );
}
