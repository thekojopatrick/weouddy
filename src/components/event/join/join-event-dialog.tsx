'use client';

import { JoinEventData } from '@/types/event';
import { JoinEventForm } from './join-event-form';
import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface JoinEventDialogProps {
	event?: JoinEventData;
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
}

const JoinEventDialog = ({
	open,
	onOpenChangeAction,
}: JoinEventDialogProps) => {
	return (
		<ResponsiveDialog
			open={open}
			onOpenChangeAction={onOpenChangeAction}
			className='sm:max-w-[620px] p-0 overflow-hidden'
		>
			<JoinEventForm />
		</ResponsiveDialog>
	);
};

export default JoinEventDialog;
