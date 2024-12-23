'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { extractIdentifierFromLink, isCUID } from '@/lib/utils';
import {
	getEventJoinInfo,
	joinEvent,
} from '@/server/actions/event/join/mutation';

import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import { QRScannerForm } from './forms/qr-scanner-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

export type JoinStep =
	| 'LINK_PASTE'
	| 'QR_SCAN'
	| 'PIN_ENTRY'
	| 'WAITING_APPROVAL'
	| 'REDIRECTING';

interface JoinEventFlowProps {
	initialStep?: JoinStep;
	initialEventData?: EventData;
	onCloseDialog?: () => void;
}

export function JoinEventFlow({
	initialStep = 'LINK_PASTE',
	initialEventData,
	onCloseDialog,
}: JoinEventFlowProps) {
	const [currentStep, setCurrentStep] = useState<JoinStep>(initialStep);
	const [isLoading, setIsLoading] = useState(false);
	const [eventData, setEventData] = useState<EventData | undefined>(
		initialEventData
	);
	const { toast } = useToast();
	const router = useRouter();

	const handleRedirectToEvent = (slug: string) => {
		if (onCloseDialog) {
			onCloseDialog();
		}
		router.push(`/events/${slug}`);
	};

	const handleJoinResult = async (result: {
		success: boolean;
		status?: string;
		error?: string;
		eventSlug?: string;
		message?: string;
	}) => {
		if (!result.success) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: result.error || 'Failed to join event',
			});
			return;
		}

		switch (result.status) {
			case 'PENDING_APPROVAL':
				setCurrentStep('WAITING_APPROVAL');
				toast({
					title: 'Request Status',
					description: result.message || 'Waiting for host approval',
				});
				break;

			case 'JOINED':
				if (result.eventSlug) {
					setCurrentStep('REDIRECTING');
					toast({
						title: 'Success',
						description: result.message || 'Successfully joined the event',
					});
					handleRedirectToEvent(result.eventSlug);
				}
				break;

			case 'NOT_JOINED':
				if (result.eventSlug && eventData && !eventData.isPrivate) {
					// Auto-join for public events
					const joinResult = await joinEvent({
						identifier: eventData.id,
						identifierType: 'id',
					});

					console.log({ joinResult });

					handleJoinResult(joinResult as never);
				}
				break;
		}
	};

	const handleEventAccess = async (identifier: string, pin?: string) => {
		try {
			const eventInfo = await getEventJoinInfo(identifier);

			if (!eventInfo.success || !eventInfo.event) {
				throw new Error(eventInfo.error || 'Failed to fetch event');
			}

			setEventData(eventInfo.event as never);

			// Handle existing member status
			if (eventInfo.userStatus === 'JOINED') {
				handleRedirectToEvent(eventInfo.event.slug!);
				return;
			}

			// Handle pending requests
			if (eventInfo.userStatus === 'PENDING') {
				setCurrentStep('WAITING_APPROVAL');
				return;
			}

			const event = eventInfo.event;

			// Public event flow
			if (!event.isPrivate) {
				const result = await joinEvent({
					identifier,
					identifierType: isCUID(identifier) ? 'id' : 'slug',
				});
				handleJoinResult(result as never);
				return;
			}

			// Private event flow
			if (event.accessType === 'PIN_REQUIRED' && !pin) {
				setCurrentStep('PIN_ENTRY');
				return;
			}

			const result = await joinEvent({
				identifier,
				identifierType: isCUID(identifier) ? 'id' : 'slug',
				pinCode: pin,
			});
			handleJoinResult(result as never);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to access event',
			});
		}
	};

	const handleLinkSubmit = async (link: string) => {
		setIsLoading(true);
		try {
			const identifier = extractIdentifierFromLink(link);
			if (!identifier) {
				throw new Error('Invalid event link');
			}
			await handleEventAccess(identifier);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePinSubmit = async (pin: string) => {
		setIsLoading(true);
		try {
			if (!eventData?.id) {
				throw new Error('Event data not found');
			}
			await handleEventAccess(eventData.id, pin);
		} finally {
			setIsLoading(false);
		}
	};

	const handleQRScanComplete = (result: string) => {
		handleLinkSubmit(result);
	};

	const renderContent = () => {
		switch (currentStep) {
			case 'LINK_PASTE':
				return (
					<LinkPasteForm
						onSubmitAction={handleLinkSubmit}
						onScanQRAction={() => setCurrentStep('QR_SCAN')}
						isLoading={isLoading}
					/>
				);

			case 'QR_SCAN':
				return (
					<QRScannerForm
						onScanCompleteAction={handleQRScanComplete}
						onBackAction={() => setCurrentStep('LINK_PASTE')}
					/>
				);

			case 'PIN_ENTRY':
				return (
					<PinEntryForm
						onSubmitAction={handlePinSubmit}
						isLoading={isLoading}
					/>
				);

			case 'WAITING_APPROVAL':
				return (
					<Alert>
						<AlertDescription>
							Your request to join has been sent. Please wait for the host to
							approve your request.
						</AlertDescription>
					</Alert>
				);

			case 'REDIRECTING':
				return (
					<Alert>
						<AlertDescription>
							Successfully joined the event! Redirecting...
						</AlertDescription>
					</Alert>
				);
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle className='text-left'>
					{currentStep === 'PIN_ENTRY'
						? 'Enter Event PIN'
						: currentStep === 'WAITING_APPROVAL'
							? 'Request Pending'
							: currentStep === 'REDIRECTING'
								? 'Success!'
								: 'Ready to join an event'}
				</DialogTitle>
			</DialogHeader>
			<div className='py-4'>{renderContent()}</div>
		</>
	);
}
