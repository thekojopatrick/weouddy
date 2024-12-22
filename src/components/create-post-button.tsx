'use client';

import { NotebookPen, Plus } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from './ui/button';
import { CreatePostModal } from './create-post-modal';
import { cn } from '@/lib/utils';

const CreatePostButton = ({
	isSmallDevice,
	eventId,
	userName,
	userAvatar,
}: {
	isSmallDevice: boolean;
	eventId: string;
	userName: string;
	userAvatar: string;
}) => {
	const [showDialog, setShowDialog] = useState(false);
	return (
		<>
			<Button
				variant={'outline'}
				size={isSmallDevice ? 'icon' : 'lg'}
				className={cn(
					'rounded-full shadow-lg',
					isSmallDevice ? 'size-12' : 'h-12'
				)}
				onClick={() => setShowDialog(true)}
			>
				{isSmallDevice ? <NotebookPen /> : <Plus className={'size-6'} />}
				<span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
					Create Post
				</span>
			</Button>
			<CreatePostModal
				open={showDialog}
				eventId={eventId}
				onOpenChangeAction={setShowDialog}
				userName={userName ?? ''}
				userAvatar={userAvatar ?? ''}
			/>
		</>
	);
};

export default CreatePostButton;
