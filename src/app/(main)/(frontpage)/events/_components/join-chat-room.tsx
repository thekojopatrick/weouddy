'use client';

import { useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/message-list';
import { Button } from '@/components/ui/button';
import CustomDrawer from '@/components/ui/custom-drawer';
import { useEventChat } from '@/hooks/event/use-chat';
import { cn } from '@/lib/utils';
import { RiChat1Fill } from '@remixicon/react';

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
    name: string;
    username?: string;
    avatarUrl: string;
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

  console.log({ isLoading });

  const handleClick = () => {
    if (!user) return null;
    setShowDialog(true);
  };

  const handleSendMessage = async (content: string) => {
    try {
      console.log({ content });

      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
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
          <RiChat1Fill className="size-6" />
        )}
        <span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
          Vibez
        </span>
      </Button>

      <CustomDrawer
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        side={!isSmallDevice}
        headerContent={
          <ChatHeader
            title="Event Chat"
            subtitle="Chat with event participants"
          />
        }
        content={
          <div className="min-h-[30vh]">
            <ChatMessages
              messages={messages}
              currentUser={user}
              isLoading={isLoading}
              onPinMessage={pinMessage}
              onDeleteMessage={deleteMessage}
            />
          </div>
        }
        footerContent={
          <ChatInput onSendMessage={handleSendMessage} />
        }
      />
    </>
  );
};

export default JoinChatRoom;
