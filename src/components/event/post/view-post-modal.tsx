import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PostWithDetails } from '@/types/prisma.types';
import { formatDistance } from 'date-fns';

type PostViewModalProps = {
	post: PostWithDetails;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onLike: () => void;
	onComment: (comment: string) => void;
};

export function PostViewModal({
	post,
	isOpen,
	onOpenChange,
	onLike,
	onComment,
}: PostViewModalProps) {
	const [newComment, setNewComment] = useState('');

	const handleCommentSubmit = () => {
		if (newComment.trim()) {
			onComment(newComment);
			setNewComment('');
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl'>
				<div className='grid grid-cols-2 gap-6'>
					{/* Media Section */}
					<div>
						{post.media.map((media) =>
							media.type === 'IMAGE' ? (
								<Image
									key={media.id}
									src={media.url}
									alt='Post media'
									className='w-full rounded-lg'
									fill
								/>
							) : (
								<video
									key={media.id}
									src={media.url}
									controls
									className='w-full rounded-lg'
								/>
							)
						)}
					</div>

					{/* Interaction Section */}
					<div className='flex flex-col'>
						{/* Post Header */}
						<div className='flex items-center space-x-3 mb-4'>
							<Avatar>
								<AvatarImage src={post.user.avatarUrl || ''} />
								<AvatarFallback>{post.user.name?.[0]}</AvatarFallback>
							</Avatar>
							<div>
								<h3 className='font-semibold'>{post.user.name}</h3>
								<p className='text-sm text-muted-foreground'>
									{formatDistance(new Date(post.createdAt), new Date(), {
										addSuffix: true,
									})}
								</p>
							</div>
						</div>

						{/* Caption */}
						<p className='mb-4'>{post.caption}</p>

						{/* Interactions */}
						<div className='flex items-center space-x-4 mb-4'>
							<Button
								variant='ghost'
								className='flex items-center space-x-2'
								onClick={onLike}
							>
								<Heart className='h-5 w-5' />
								<span>{post._count.likes}</span>
							</Button>
							<Button variant='ghost' className='flex items-center space-x-2'>
								<MessageCircle className='h-5 w-5' />
								<span>{post._count.comments}</span>
							</Button>
							<Button variant='ghost'>
								<Share2 className='h-5 w-5' />
							</Button>
						</div>

						{/* Comments Section */}
						<div className='flex-grow overflow-y-auto mb-4'>
							{post.comments.map((comment) => (
								<div key={comment.id} className='flex space-x-2 mb-2'>
									<Avatar size='sm'>
										<AvatarImage src={comment.user.avatarUrl || ''} />
										<AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-semibold'>{comment.user.name}</p>
										<p>{comment.content}</p>
									</div>
								</div>
							))}
						</div>

						{/* Comment Input */}
						<div className='flex space-x-2'>
							<input
								type='text'
								placeholder='Add a comment...'
								className='flex-grow border rounded-lg p-2'
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
							/>
							<Button onClick={handleCommentSubmit}>Send</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
