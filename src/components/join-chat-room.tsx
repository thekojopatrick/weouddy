'use client';

import React, { useState } from 'react';

import { Button } from './ui/button';
import CustomSheet from './ui/custom-sheet';
import { RiChat1Fill } from '@remixicon/react';
import { cn } from '@/lib/utils';

const JoinChatRoom = ({
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
				{isSmallDevice ? <RiChat1Fill /> : <RiChat1Fill className={'size-6'} />}
				<span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
					Vibes
				</span>
			</Button>
			<CustomSheet
				isOpen={showDialog}
				onCloseAction={() => setShowDialog(false)}
				side={isSmallDevice ? 'bottom' : 'right'}
				title={`Chatroom ${eventId}`}
				content={`${userName}`}
				stickyHeader={true}
				stickyFooter={true}
				scrollableContent={true}
				maxHeight={isSmallDevice ? '90vh' : '80vh'}
				footerContent={`${userAvatar}`}
			/>
		</>
	);
};

export default JoinChatRoom;
