"use client";
import React, { useState } from "react";
import { EventFormValues } from "@/types/validation";
import { useEvents } from "@/hooks/event/use-event";
import { useToast } from "@/hooks/use-toast";
import { CreateEventForm } from "./create-event-form";
import { SuccessStep } from "./steps/success";
import { getURL } from "@/lib/utils";
import { createEvent } from "@/components/deactivated/actions/create-event";

interface EventCreationManagerProps {
  onClose: () => void;
}

interface EventCreationResult {
  eventUrl: string;
  qrCodeUrl: string;
  eventName: string;
}

export function EventCreationManager({ onClose }: EventCreationManagerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventData, setEventData] = useState<EventCreationResult | null>(null);
  const { invalidateEvents } = useEvents();
  const { toast } = useToast();
  const baseUrl = getURL();

  const handleEventSubmit = async (data: EventFormValues) => {
    setIsProcessing(true);

    try {
      const event = await createEvent(data);

      if (event) {
        // Update cache in background
        invalidateEvents();

        // Show success toast
        toast({
          title: "Event created!",
          description: "Your event room has been created successfully.",
        });

        // Set event data for success step
        setEventData({
          eventUrl: `${baseUrl}events/${event.slug}`,
          qrCodeUrl: event.qrCodeUrl!,
          eventName: event.name,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      toast({
        title: "Error creating event",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show success step if event was created
  if (eventData) {
    return (
      <SuccessStep
        eventUrl={eventData.eventUrl}
        qrCodeUrl={eventData.qrCodeUrl}
        eventName={eventData.eventName}
        onCloseAction={onClose}
      />
    );
  }

  // Show form while creating or if not yet created
  return (
    <CreateEventForm
      onCloseAction={onClose}
      onSubmit={handleEventSubmit}
      disabled={isProcessing}
    />
  );
}
