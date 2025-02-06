"use client";

import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EventCreationManager } from "./event-creation-manager";
import { useCreateEventStore } from "@/stores/use-create-event-store";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  userId: string;
}

export function CreateEventDialog({
  open,
  onOpenChangeAction,
}: CreateEventDialogProps) {
  const { resetStore } = useCreateEventStore();

  const handleClose = () => {
    resetStore();
    onOpenChangeAction(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      className="sm:max-w-[620px] p-0"
    >
      <DialogTitle className="sr-only">Create Modal Modal</DialogTitle>
      <div className="relative px-4 md:p-4">
        <EventCreationManager onClose={handleClose} />
      </div>
    </ResponsiveDialog>
  );
}
