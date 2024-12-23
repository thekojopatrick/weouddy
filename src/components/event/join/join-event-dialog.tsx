'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { JoinEventFlow } from './join-event-flow';
import { JoinStep } from './join-event-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { joinEvent } from '@/server/actions/event/join/mutation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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

const JoinEventDialog = ({
	event,
	initialStep,
	open,
	onOpenChangeAction,
}: JoinEventDialogProps) => {
	const [isAutoJoining, setIsAutoJoining] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	// Function to handle auto-join for public events
	const handleAutoJoin = async () => {
		if (!event?.id) return;

		setIsAutoJoining(true);
		try {
			const [result] = await Promise.all([
				joinEvent({ identifier: event.id, identifierType: 'id' }),
			]);

			if (result.success && result.eventSlug) {
				toast({
					title: 'Success',
					description: result.message || 'Successfully joined the event',
				});
				onOpenChangeAction(false);
				router.push(`/events/${result.eventSlug}`);
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to join event',
			});
			console.log({ error });
		} finally {
			setIsAutoJoining(false);
		}
	};

	// Effect to handle auto-join when dialog opens
	useEffect(() => {
		if (open && event && !event.isPrivate && !event.requiresApproval) {
			handleAutoJoin();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, event]);

	const getInitialStep = (): JoinStep => {
		if (isAutoJoining) {
			return 'REDIRECTING';
		}

		if (!event) {
			return initialStep ?? 'LINK_PASTE';
		}

		if (event.isPrivate && event.requiresApproval) {
			return 'PIN_ENTRY';
		}

		return initialStep ?? 'LINK_PASTE';
	};

	return (
		<ResponsiveDialog
			open={open}
			onOpenChangeAction={onOpenChangeAction}
			className='sm:max-w-[420px] overflow-hidden py-3 px-4'
		>
			<div className="'flex flex-col items-center gap-4 justify-center">
				<Image
					src='/brand/logomark.svg'
					alt='WeOuddy'
					width={48}
					height={48}
					className='h-12 w-12 mb-5'
				/>
				<JoinEventFlow
					initialEventData={event}
					initialStep={getInitialStep()}
					onCloseDialog={() => onOpenChangeAction(false)}
				/>
			</div>
		</ResponsiveDialog>
	);
};

export default JoinEventDialog;
