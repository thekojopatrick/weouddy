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
	const getInitialStep = (): JoinStep => {
		if (!event) {
			return initialStep ?? 'LINK_PASTE';
		}

		if (event.isPrivate && event.requiresApproval) {
			return 'PIN_ENTRY';
		}

		if (!event.isPrivate && !event.requiresApproval) {
			return 'REDIRECTING'; // Default step for public events
		}

		return initialStep ?? 'LINK_PASTE';
	};

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
				<JoinEventForm
					initialEventData={event}
					initialStep={getInitialStep()}
				/>
			</div>
		</ResponsiveDialog>
	);
};

export default JoinEventDialog;
