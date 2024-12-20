'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { formatTimeAgo } from '@/lib/formatters';
import { getNameInitials } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useState } from 'react';

interface Comment {
	id: string;
	content: string;
	createdAt: string;
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
	comments: Comment[];
}

export function Comments({
	open,
	onOpenChangeAction,
	handleCommentAction,
	comments,
}: CommentsProps) {
	const [comment, setComment] = useState('');
	//const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

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
		<div className='space-y-4'>
			{comments?.map((comment) => (
				<div key={comment.id} className='flex gap-2'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={comment.user.avatarUrl || undefined} />
						<AvatarFallback className='text-xs'>
							{getNameInitials(comment.user.name)}
						</AvatarFallback>
					</Avatar>
					<div className='flex-1'>
						<div className='flex items-center gap-2'>
							<span className='font-medium text-sm'>{comment.user.name}</span>
							<span className='text-xs text-muted-foreground'>
								{formatTimeAgo(new Date(comment.createdAt))}
							</span>
						</div>
						<p className='text-sm'>{comment.content}</p>
					</div>
				</div>
			))}
		</div>
	);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChangeAction}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Comments</DialogTitle>
					</DialogHeader>
					<div className='h-[400px] overflow-y-auto px-1'>
						<CommentList />
					</div>

					<form onSubmit={onSubmit} className='flex gap-2 py-4'>
						<Input
							placeholder='Add a comment...'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							disabled={isLoading}
						/>
						<Button type='submit' size='icon' disabled={isLoading}>
							<Send className='h-4 w-4' />
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChangeAction}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Comments</DrawerTitle>
				</DrawerHeader>
				<div className='px-4'>
					<div className='h-[50vh] overflow-y-auto px-1'>
						<CommentList />
					</div>
					<form onSubmit={onSubmit} className='flex gap-2 py-4'>
						<Input
							placeholder='Add a comment...'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							disabled={isLoading}
						/>
						<Button type='submit' size='icon' disabled={isLoading}>
							<Send className='h-4 w-4' />
						</Button>
					</form>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
