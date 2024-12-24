'use client';

import React, { memo, useCallback } from 'react';

import Image from 'next/image';
import { JoinEventFlow } from './join-event-flow';
import { JoinStep } from './join-event-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

type EventAccessType = 'LINK_ONLY' | 'PIN_REQUIRED';
interface EventData {
	id: string;
	slug: string;
	isPrivate: boolean;
	isDisabled: boolean;
	requiresApproval: boolean;
	accessType: EventAccessType;
}

interface JoinEventDialogProps {
	event?: EventData;
	initialStep?: JoinStep;
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
}

const JoinEventDialog = memo(
	({ event, initialStep, open, onOpenChangeAction }: JoinEventDialogProps) => {
		const getInitialStep = useCallback((): JoinStep => {
			if (!event) {
				return initialStep ?? 'LINK_PASTE';
			}

			if (!event.isPrivate) {
				return 'REDIRECTING';
			}

			if (event.isPrivate && event.accessType === 'PIN_REQUIRED') {
				return 'PIN_ENTRY';
			}

			return initialStep ?? 'LINK_PASTE';
		}, [event, initialStep]);

		return (
			<ResponsiveDialog
				open={open}
				onOpenChangeAction={onOpenChangeAction}
				className='sm:max-w-[420px] overflow-hidden py-3 px-4'
			>
				<div className='flex flex-col justify-center'>
					<Image
						src='/brand/logomark.svg'
						alt='WeOuddy'
						width={48}
						height={48}
						className='h-12 w-12 mb-5'
						priority
					/>
					<JoinEventFlow
						initialEventData={event}
						initialStep={getInitialStep()}
						onCloseDialog={() => onOpenChangeAction(false)}
					/>
				</div>
			</ResponsiveDialog>
		);
	}
);

JoinEventDialog.displayName = 'JoinEventDialog';

export default JoinEventDialog;
