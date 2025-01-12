'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import CustomSheet from '@/components/ui/custom-sheet';
import { RiChat1Fill } from '@remixicon/react';
import { cn } from '@/lib/utils';
import EventChatRoom from './event-room-chat';

const JoinChatRoom = ({
  isSmallDevice,
  eventId,
  user,
}: {
  isSmallDevice: boolean;
  eventId: string;
  eventName?: string;
  user: {
    id: string;
    userName: string;
    userAvatar: string;
  };
}) => {
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
          <RiChat1Fill />
        ) : (
          <RiChat1Fill className={'size-6'} />
        )}
        <span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
          Vibez
        </span>
      </Button>
      <CustomSheet
        isOpen={showDialog}
        onCloseAction={() => setShowDialog(false)}
        side={isSmallDevice ? 'bottom' : 'right'}
        title={`Vibez`}
        content={<EventChatRoom eventId={eventId} userId={user.id} />}
        stickyHeader={true}
        stickyFooter={true}
        scrollableContent={true}
        maxHeight={isSmallDevice ? '90vh' : '80vh'}
      />
    </>
  );
};

export default JoinChatRoom;
