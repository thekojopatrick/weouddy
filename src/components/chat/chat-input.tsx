'use client';

import { FC, FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { LoadingButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmojiPicker } from '../emoji-picker';

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
      className="flex gap-2 bg-background w-full"
    >
      <div className="relative flex-1 rounded-full bg-black/5">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          disabled={disabled || isSending}
          className="pr-10 rounded-full h-[44px]"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1">
          <EmojiPicker
            onEmojiSelectAction={(emoji) =>
              setMessage((prev) => prev + emoji)
            }
          />
        </div>
      </div>
      <LoadingButton
        type="submit"
        size="icon"
        className={`rounded-lg bg-zinc-100 text-black hover:text-white `}
        disabled={disabled || isSending || !message.trim()}
        loading={isSending}
      >
        {isSending ? (
          <span className="animate-ping">...</span>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </LoadingButton>
    </form>
  );
};
