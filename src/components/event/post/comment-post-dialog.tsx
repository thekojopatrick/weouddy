'use client';

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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useState } from 'react';

interface CommentsProps {
	postId: string;
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
}

export function Comments({ postId, open, onOpenChangeAction }: CommentsProps) {
	const [comment, setComment] = useState('');
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle comment submission
		setComment('');
		console.log({ postId });
	};

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChangeAction}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Comments</DialogTitle>
					</DialogHeader>
					<div className='h-[400px] overflow-y-auto'>
						{/* Comment list would go here */}
					</div>
					<form onSubmit={onSubmit} className='flex gap-2 pt-4'>
						<Input
							placeholder='Add a comment...'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<Button type='submit' size='icon'>
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
					<div className='h-[50vh] overflow-y-auto'>
						{/* Comment list would go here */}
					</div>
					<form onSubmit={onSubmit} className='flex gap-2 py-4'>
						<Input
							placeholder='Add a comment...'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<Button type='submit' size='icon'>
							<Send className='h-4 w-4' />
						</Button>
					</form>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
