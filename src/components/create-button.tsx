'use client';

import { Button } from '@/components/ui/button';
import { CreateEventDialog } from './event//create/create-event-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function CreateEventButton() {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<Button
				size='lg'
				className='rounded-full shadow-lg'
				onClick={() => setShowDialog(true)}
			>
				<Plus className='mr-2 h-5 w-5' />
				Create Event
			</Button>

			<CreateEventDialog open={showDialog} onOpenChangeAction={setShowDialog} />
		</>
	);
}
