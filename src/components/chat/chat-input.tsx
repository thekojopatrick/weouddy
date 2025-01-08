'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChatSettings } from '@/types/chat';

interface ChatInputProps {
  eventId?: string;
  userId?: string;
  isGuest: boolean;
  settings: ChatSettings;
  onSendMessage: (content: string) => Promise<void>;
  lastMessageTime?: Date;
}

export function ChatInput({
  isGuest,
  settings,
  onSendMessage,
  lastMessageTime,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Check if chat is enabled
    if (!settings.isEnabled) {
      toast({
        title: 'Chat Disabled',
        description: 'The chat is currently disabled by the host.',
        variant: 'destructive',
      });
      return;
    }

    // Check guest permissions
    if (isGuest && !settings.allowGuestMessages) {
      toast({
        title: 'Guests Restricted',
        description: 'Only registered users can send messages.',
        variant: 'destructive',
      });
      return;
    }

    // Check slow mode
    if (settings.slowMode && lastMessageTime) {
      const timeSinceLastMessage =
        Date.now() - lastMessageTime.getTime();
      const cooldownTime = settings.slowModeInterval * 1000;
      if (timeSinceLastMessage < cooldownTime) {
        const remainingTime = Math.ceil(
          (cooldownTime - timeSinceLastMessage) / 1000
        );
        setCooldown(remainingTime);
        toast({
          title: 'Slow Mode Active',
          description: `Please wait ${remainingTime} seconds before sending another message.`,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading || cooldown > 0 || !settings.isEnabled}
        className="min-h-[80px]"
      />
      <div className="flex items-center justify-between">
        {cooldown > 0 && (
          <span className="text-sm text-muted-foreground">
            Wait {cooldown}s to send another message
          </span>
        )}
        <Button
          type="submit"
          disabled={
            isLoading ||
            cooldown > 0 ||
            !message.trim() ||
            !settings.isEnabled
          }
          className="ml-auto"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </form>
  );
}
