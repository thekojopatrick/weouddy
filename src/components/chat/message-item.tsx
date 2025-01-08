'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pin, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import type { ChatMessage } from '@/types/chat';
import { pinMessage } from '@/server/actions/chat/mutations';

interface MessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isHost: boolean;
}

export function MessageItem({ message, isHost }: MessageItemProps) {
  const [isPinned, setIsPinned] = useState(message.isPinned);

  const handlePin = async () => {
    try {
      await pinMessage(message.id, !isPinned);
      setIsPinned(!isPinned);
    } catch (error) {
      console.error('Failed to pin message:', error);
    }
  };

  //   const handleHide = async () => {
  //     try {
  //       await hideMessage(message.id);
  //     } catch (error) {
  //       console.error('Failed to hide message:', error);
  //     }
  //   };

  if (!isHost) return null;

  return (
    <div
      className={`flex items-start gap-4 ${isPinned ? 'bg-muted/50 p-4 rounded-lg' : ''}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={`https://avatar.vercel.sh/${message.user.id}`}
          alt={message.user.name || 'User'}
        />
        <AvatarFallback>
          {message.user.name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {message.user.name || 'Anonymous'}
          </span>
          {message.user.isGuest && (
            <Badge variant="secondary">Guest</Badge>
          )}
          {isPinned && (
            <Badge variant="default">
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm">{message.content}</p>
      </div>
      {isHost && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handlePin}>
              <Pin className="h-4 w-4 mr-2" />
              {isPinned ? 'Unpin' : 'Pin'}
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={handleHide}>
              {message.isHidden ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              )}
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
