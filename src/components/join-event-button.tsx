'use client';

import { Button } from '@/components/ui/button';
import JoinEventDialog from './event/join/join-event-dialog';
import { ScanFace } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function JoinEventButton({ isSmallDevice }: { isSmallDevice: boolean }) {
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
