'use client';

import { FC, FormEvent, useState } from 'react';
import { Send, SmilePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t flex gap-2 bg-background"
    >
      <div className="relative flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          disabled={disabled || isSending}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted"
        >
          <SmilePlus className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={disabled || isSending || !message.trim()}
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
