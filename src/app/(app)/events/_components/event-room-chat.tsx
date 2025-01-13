'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useEventChat } from '@/hooks/event/use-event-chat';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';

interface EventChatRoomProps {
  eventId: string;
  userId: string;
}

const EventChatRoom: FC<EventChatRoomProps> = ({
  eventId,
  userId,
}) => {
  const {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    pinMessage,
  } = useEventChat(eventId, userId);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Card className="w-full max-w-md h-full flex flex-col">
      <ChatHeader
        title="Event Chat"
        subtitle="Chat with event participants"
      />
      <CardContent className="flex-1 p-0 flex flex-col">
        <ChatMessages
          messages={messages}
          currentUserId={userId}
          isLoading={isLoading}
          onPinMessage={pinMessage}
          onDeleteMessage={deleteMessage}
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </CardContent>
    </Card>
  );
};

export default EventChatRoom;
