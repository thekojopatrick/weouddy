'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import CustomSheet from '@/components/ui/custom-sheet';
import { RiChat1Fill } from '@remixicon/react';
import { cn } from '@/lib/utils';
import { useEventChat } from '@/hooks/event/use-event-chat';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';

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
  const {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    pinMessage,
  } = useEventChat(eventId, user.id);

  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    if (!user) return null;
    setShowDialog(true);
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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
        headerContent={
          <ChatHeader
            title="Event Chat"
            subtitle="Chat with event participants"
          />
        }
        content={
          <ChatMessages
            messages={messages}
            currentUserId={user.id}
            isLoading={isLoading}
            onPinMessage={pinMessage}
            onDeleteMessage={deleteMessage}
          />
        }
        stickyHeader={true}
        stickyFooter={true}
        scrollableContent={true}
        footerContent={
          <ChatInput onSendMessage={handleSendMessage} />
        }
      />
    </>
  );
};

export default JoinChatRoom;
