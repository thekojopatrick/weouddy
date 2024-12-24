'use client';

import { Button } from '@/components/ui/button';
import JoinEventDialog from './event/join/join-event-dialog';
import { ScanFace } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function JoinEventButton({
	isSmallDevice,
	user,
}: {
	isSmallDevice: boolean;
	user: User;
}) {
	const [showDialog, setShowDialog] = useState(false);

	const handleClick = () => {
		if (!user) return null;
		setShowDialog(true);
	};

	return (
		<>
			<Button
				variant={'outline'}
				size={isSmallDevice ? 'icon' : 'lg'}
				className={cn(
					'rounded-full shadow-lg',
					isSmallDevice ? 'size-12' : 'h-12'
				)}
				onClick={handleClick}
			>
				{isSmallDevice ? (
					<ScanFace className={'size-6'} />
				) : (
					<ScanFace className={'size-6'} />
				)}
				<span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
					Join Event
				</span>
			</Button>

			<JoinEventDialog open={showDialog} onOpenChangeAction={setShowDialog} />
		</>
	);
}
