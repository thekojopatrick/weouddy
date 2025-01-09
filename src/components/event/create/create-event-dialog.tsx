'use client';

import { CreateEventForm } from './create-event-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  userId: string;
}

export function CreateEventDialog({
  open,
  onOpenChangeAction,
  userId,
}: CreateEventDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      className="sm:max-w-[620px] p-0"
    >
      <div className="relative p-4">
        <CreateEventForm
          onCloseAction={() => onOpenChangeAction(false)}
          userId={userId}
        />
      </div>
    </ResponsiveDialog>
  );
}
