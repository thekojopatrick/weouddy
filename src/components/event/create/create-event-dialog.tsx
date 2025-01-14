'use client';

import { CreateEventForm } from './create-event-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  userId: string;
}

export function CreateEventDialog({
  open,
  onOpenChangeAction,
}: CreateEventDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      className="sm:max-w-[620px] p-0"
    >
      <DialogTitle className="sr-only">
        Create Modal Modal
      </DialogTitle>
      <div className="relative px-4 md:p-4">
        <CreateEventForm
          onCloseAction={() => onOpenChangeAction(false)}
        />
      </div>
    </ResponsiveDialog>
  );
}
