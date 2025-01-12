import { FC } from 'react';
import { ChatMessage } from '@/types/chat';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Pin, MoreVertical, CheckCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatMessageProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  onPinMessage: (messageId: string, isPinned: boolean) => void;
  onDeleteMessage: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

export const ChatMessageItem: FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
  onPinMessage,
  onDeleteMessage,
  onReaction,
}) => {
  const displayName =
    message.user?.name || message.user?.username || 'Anonymous';

  return (
    <div
      className={`flex gap-2 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.user?.avatarUrl as never} />
        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col ${isOwnMessage ? 'items-end' : ''}`}
      >
        <div
          className={`flex items-center gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
        >
          <span className="text-sm font-medium">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.status && (
            <span className="text-muted-foreground">
              {message.status === 'read' ? (
                <CheckCheck className="h-4 w-4 text-blue-500" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </span>
          )}
        </div>

        <div
          className={`
          max-w-[280px] rounded-lg p-2 mt-1
          ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}
        `}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() =>
                  onReaction?.(message.id, reaction.emoji)
                }
                className={`px-2 py-1 rounded-lg text-sm flex items-center gap-1 ${
                  reaction.reacted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {message.isPinned && (
          <div className="flex items-center gap-1 mt-1">
            <Pin className="h-3 w-3" />
            <span className="text-xs">Pinned</span>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              onPinMessage(message.id, !message.isPinned)
            }
          >
            {message.isPinned ? 'Unpin Message' : 'Pin Message'}
          </DropdownMenuItem>
          {isOwnMessage && (
            <DropdownMenuItem
              onClick={() => onDeleteMessage(message.id)}
              className="text-destructive"
            >
              Delete Message
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
