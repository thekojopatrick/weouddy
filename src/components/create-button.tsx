'use client';

import { CalendarPlus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CreateEventDialog } from './event//create/create-event-dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function CreateEventButton({
	isSmallDevice,
}: {
	isSmallDevice: boolean;
}) {
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
				{isSmallDevice ? <CalendarPlus /> : <Plus className={'size-6'} />}
				<span className={isSmallDevice ? 'sr-only' : 'font-semibold'}>
					Create Event
				</span>
			</Button>

			<CreateEventDialog open={showDialog} onOpenChangeAction={setShowDialog} />
		</>
	);
}
