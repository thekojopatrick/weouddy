"use client";

import { Copy, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRDownload } from "@/components/event/qr/qr-download";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  eventId: string;
  eventName: string;
  qrCode: {
    dataUrl: string;
    downloadUrl: string;
    fileName: string;
    publicUrl: string;
  };
}

export function ShareDialog({ eventId, eventName, qrCode }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const shareUrlRef = useRef(""); // Initialize with empty string

  useEffect(() => {
    // Set the URL after component mounts
    if (typeof window !== "undefined") {
      if (window.location.href.includes("localhost")) {
        shareUrlRef.current = `${window.location.href}/event/${eventId}`;
      } else {
        shareUrlRef.current = `${window.location.origin}/event/${eventId}`;
      }
    }
  }, [eventId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrlRef.current);
      toast({
        title: "Link copied!",
        description: "The event link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share event</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <QRDownload qrCode={qrCode} eventName={eventName} />
          <div className="flex items-center space-x-2">
            <Input value={shareUrlRef.current} readOnly className="flex-1" />
            <Button variant="secondary" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
