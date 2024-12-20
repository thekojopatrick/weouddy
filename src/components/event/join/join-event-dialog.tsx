'use client';

import { JoinEventForm, JoinStep } from './join-event-form';

import Image from 'next/image';
import { JoinEventData } from '@/types/event';
import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface JoinEventDialogProps {
	event?: JoinEventData;
	initialStep?: JoinStep;
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
}

const JoinEventDialog = ({
	event,
	initialStep,
	open,
	onOpenChangeAction,
}: JoinEventDialogProps) => {
	return (
		<ResponsiveDialog
			open={open}
			onOpenChangeAction={onOpenChangeAction}
			className='sm:max-w-[620px] overflow-hidden py-3 px-4'
		>
			<div className="'flex flex-col items-center gap-4 justify-center">
				<Image
					src='/brand/logomark.svg'
					alt='WeOuddy'
					width={48}
					height={48}
					className='h-12 w-12 mb-5'
				/>
				<JoinEventForm initialEventData={event} initialStep={initialStep} />
			</div>
		</ResponsiveDialog>
	);
};

export default JoinEventDialog;
