'use client';

import { CalendarPlus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CreateEventDialog } from './create-event-dialog';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function CreateEventButton({
  isSmallDevice,
  user,
}: {
  isSmallDevice: boolean;
  user: User;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    if (!user) return null;
    setShowDialog(true);
  };

  return (
    <>
      <Button
        variant={'outline'}
        size={isSmallDevice ? 'icon' : 'lg'}
        className={cn(
          'rounded-full shadow-lg',
          isSmallDevice ? 'size-12' : 'h-12'
        )}
        onClick={handleClick}
      >
        {isSmallDevice ? (
          <CalendarPlus />
        ) : (
          <Plus className={'size-6'} />
        )}
        <span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
          Create Event
        </span>
      </Button>

      <CreateEventDialog
        open={showDialog}
        onOpenChangeAction={setShowDialog}
        userId={user?.id}
      />
    </>
  );
}
