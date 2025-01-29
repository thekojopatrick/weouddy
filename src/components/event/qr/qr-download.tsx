"use client";

import { Download, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { QRCodeType } from "@/lib/qr/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QRDownloadProps {
  qrCode: QRCodeType;
  eventName: string;
}

export function QRDownload({ qrCode, eventName }: QRDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = qrCode.dataUrl;
      link.download = qrCode.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "QR Code Downloaded",
        description: "The QR code has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the QR code. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      // Ensure we have a valid URL
      const shareUrl =
        qrCode?.publicUrl ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/events/${eventName}`
          : "URL not available");

      if (navigator.share) {
        await navigator.share({
          title: `QR Code for ${eventName}`,
          text: "Scan this QR code to join the event",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(qrCode.publicUrl);
        toast({
          title: "Link Copied",
          description: "QR code link copied to clipboard",
        });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast({
          title: "Share Failed",
          description: "Failed to share the QR code",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative aspect-square w-64">
          <Image
            src={qrCode?.dataUrl}
            alt={`QR Code for ${eventName}`}
            fill
            className="rounded-lg"
            priority
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="w-full sm:w-auto"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
}
