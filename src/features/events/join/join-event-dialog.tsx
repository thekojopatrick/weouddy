"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { useJoinEvent } from "@/hooks/event/use-join-event";
import { PinEntryForm } from "./forms/pin-entry-form";
import JoinEventSuccess from "./forms/success";
import { useCallback, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  accessType: "DIRECT_PASS" | "PIN_REQUIRED" | "INVITE_ONLY";
  requiresApproval?: boolean;
  userStatus: "JOINED" | "NOT_JOINED";
}

export function JoinEventDialog({
  open,
  onOpenChange,
  eventId,
  accessType,
  requiresApproval,
  userStatus,
}: JoinEventDialogProps) {
  const router = useRouter();
  const {
    joinMutation,
    handlePinSubmit,
    handleJoinViaCard,
    debouncedJoinEvent,
    debouncedJoinViaLink,
    isLoading,
  } = useJoinEvent();

  // Handle PIN submission
  const handlePinSubmitWrapper = useCallback(
    (identifier: string, pin: string) => {
      handlePinSubmit(identifier, pin);
    },
    [handlePinSubmit],
  );

  useEffect(() => {
    if (
      open &&
      accessType === "DIRECT_PASS" &&
      !isLoading &&
      !joinMutation.isSuccess
    ) {
      handleJoinViaCard(eventId);
    }
  }, [
    open,
    accessType,
    eventId,
    handleJoinViaCard,
    isLoading,
    joinMutation.isSuccess,
  ]);

  // Add this useEffect to handle success state
  useEffect(() => {
    if (joinMutation.isSuccess) {
      onOpenChange(false); // Close the dialog
      router.refresh(); // Refresh page state
    }
  }, [joinMutation.isSuccess, onOpenChange, router]);

  useEffect(() => {
    return () => {
      debouncedJoinEvent.cancel();
      debouncedJoinViaLink.cancel();
    };
  }, [debouncedJoinEvent, debouncedJoinViaLink]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    router.push("/discover");
  }, [onOpenChange, router]);

  // Determine what content to show based on the current state
  const renderContent = () => {
    if (isLoading) {
      return <JoinEventSuccess isLoading={isLoading} />;
    }

    if (joinMutation.isSuccess) {
      if (joinMutation.data.status === "PENDING") {
        return (
          <Alert>
            <AlertDescription>
              Request sent. Waiting for host approval.
            </AlertDescription>
          </Alert>
        );
      }
      return <JoinEventSuccess isLoading={false} />;
    }

    if (accessType === "PIN_REQUIRED" && userStatus === "NOT_JOINED") {
      return (
        <PinEntryForm
          onSubmitAction={handlePinSubmitWrapper}
          isLoading={isLoading}
          eventId={eventId}
        />
      );
    }

    return (
      <Alert>
        <AlertDescription className="text-center">
          Processing your request to join...
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) handleCancel();
      }}
    >
      <AlertDialogContent className="gap-2">
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle className="text-sm">
            {accessType === "PIN_REQUIRED"
              ? "Verify Event Access"
              : requiresApproval
                ? "Request Event Access"
                : "Join Event"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        {renderContent()}
        <Button
          variant="outline"
          className="w-full shadow-none"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
