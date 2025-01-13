'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmojiPicker } from '@/components/emoji-picker';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/formatters';
import { getNameInitials } from '@/lib/utils';
import useCurrentUser from '@/hooks/account/use-current-user';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useState } from 'react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface CommentsProps {
  postId?: string;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  handleCommentAction: (content: string) => Promise<void>;
  handleDeleteCommentAction: (commentId: string) => Promise<void>;
  comments: Comment[];
  currentUserId: string;
}

export function Comments({
  open,
  onOpenChangeAction,
  handleCommentAction,
  handleDeleteCommentAction,
  comments,
  currentUserId,
}: CommentsProps) {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const currentUser = useCurrentUser(currentUserId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsLoading(true);
    try {
      await handleCommentAction(comment.trim());
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CommentList = () => (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2 group">
          <Avatar className="size-5">
            <AvatarImage src={comment.user.avatarUrl || undefined} />
            <AvatarFallback className="text-xs">
              {getNameInitials(comment.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 comment">
            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs tracking-tight">
                  {comment.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(new Date(comment.createdAt))}
                </span>
              </div>
              <p className="text-xs">{comment.content}</p>
            </div>
          </div>
          {comment.userId === currentUserId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${isDesktop ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() =>
                    handleDeleteCommentAction(comment.id)
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-sm">Comments</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] overflow-y-auto px-1">
            <CommentList />
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 py-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatarUrl ?? ''} />
              <AvatarFallback className="text-xs">
                {getNameInitials(currentUser?.name as string)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center relative">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isLoading}
                className="rounded-full text-xs pr-10"
              />
              <div className="absolute right-1">
                <EmojiPicker
                  onEmojiSelectAction={(emoji) =>
                    setComment((prev) => prev + emoji)
                  }
                />
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              className="rounded-full"
              disabled={isLoading}
            >
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChangeAction}>
      <DrawerContent className="max-h-[60vh]">
        <DrawerHeader>
          <DrawerTitle className="text-sm">Comments</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <div className="overflow-y-auto px-1">
            <CommentList />
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 py-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatarUrl ?? ''} />
              <AvatarFallback className="text-xs">
                {getNameInitials(currentUser?.name as string)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center relative">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isLoading}
                className="rounded-full text-xs pr-10 shadow-sm "
              />
              <div className="absolute right-1">
                <EmojiPicker
                  onEmojiSelectAction={(emoji) =>
                    setComment((prev) => prev + emoji)
                  }
                />
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              className="rounded-full"
              disabled={isLoading}
            >
              Send
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
