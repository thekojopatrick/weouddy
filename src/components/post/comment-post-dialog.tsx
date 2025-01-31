'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
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
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

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
    <div className="space-y-4 h-full">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="flex gap-2 group">
            <Avatar className="size-5">
              <AvatarImage
                src={comment.user.avatarUrl || undefined}
              />
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
        ))
      ) : (
        <div className="grid place-content-center h-full w-full">
          <p className="text-center">No comments</p>
        </div>
      )}
    </div>
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      className="p-0 gap-0"
    >
      <div className="flex flex-col h-full">
        <DialogTitle className="border-b px-4 pb-3 md:py-3 ">
          <h2 className="font-semibold text-sm text-center">
            Comments
          </h2>
        </DialogTitle>

        <div
          className={`flex-1 overflow-y-auto px-4 py-2 ${isDesktop ? 'h-[400px] min-h-[40vh]' : 'min-h-[40vh]'}`}
        >
          <CommentList />
        </div>

        <div className="border-t px-4 py-3">
          <form onSubmit={onSubmit} className="flex gap-2">
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
                className="rounded-full text-xs pr-10 shadow-xs"
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
      </div>
    </ResponsiveDialog>
  );
}
