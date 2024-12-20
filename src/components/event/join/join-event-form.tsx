'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { extractIdentifierFromLink, isCUID } from '@/lib/utils';
import {
	getEventJoinInfo,
	joinEvent,
} from '@/server/actions/event/join/mutation';

import { EventWithDetails } from '@/types/prisma.types';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import { QRScannerForm } from './forms/qr-scanner-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type InitialEventData = Pick<
	EventWithDetails,
	'id' | 'slug' | 'isPrivate' | 'isDisabled' | 'requiresApproval'
>;

export type JoinStep =
	| 'LINK_PASTE'
	| 'QR_SCAN'
	| 'PIN_ENTRY'
	| 'WAITING_APPROVAL'
	| 'REDIRECTING';

interface JoinEventFormProps {
	initialStep?: JoinStep;
	initialEventData?: InitialEventData;
	onCloseDialog?: () => void;
}

export function JoinEventForm({
	initialStep = 'LINK_PASTE',
	initialEventData,
	onCloseDialog,
}: JoinEventFormProps) {
	const [currentStep, setCurrentStep] = useState<JoinStep>(initialStep);
	const [isLoading, setIsLoading] = useState(false);
	const [eventData, setEventData] = useState<InitialEventData | undefined>(
		initialEventData
	);
	const { toast } = useToast();
	const router = useRouter();

	const handleRedirectToEvent = (slug: string) => {
		if (onCloseDialog) {
			onCloseDialog();
		}
		router.push(`/events/${slug}`);

		console.log({ slug });
	};

	const handleLinkSubmit = async (link: string) => {
		console.log({ link });

		setIsLoading(true);
		try {
			const identifier = extractIdentifierFromLink(link);
			if (!identifier) {
				throw new Error('Invalid event link');
			}

			// Fetch event info using server action
			const eventInfo = await getEventJoinInfo(identifier);

			if (!eventInfo.success || !eventInfo.event) {
				throw new Error(eventInfo.error || 'Failed to fetch event');
			}

			setEventData(eventInfo.event as never);

			// If user is already a member, redirect directly
			if (eventInfo.userStatus === 'JOINED') {
				handleRedirectToEvent(eventInfo.event.slug!);
				return;
			}

			// If there's a pending request, show waiting screen
			if (eventInfo.userStatus === 'PENDING') {
				setCurrentStep('WAITING_APPROVAL');
				return;
			}

			if (eventInfo.event.accessType === 'PIN_REQUIRED') {
				setCurrentStep('PIN_ENTRY');
			} else {
				// Direct join attempt
				const result = await joinEvent({
					identifier,
					identifierType: isCUID(identifier) ? 'id' : 'slug',
				});
				handleJoinResult(result as never);
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to join event',
			});
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

			const result = await joinEvent({
				identifier: eventData.id,
				identifierType: 'id',
				pinCode: pin,
			});

			handleJoinResult(result as never);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to verify PIN',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoinResult = (result: {
		success: boolean;
		status?: string;
		error?: string;
		eventSlug?: string;
		message?: string;
	}) => {
		if (result.success) {
			if (result.status === 'PENDING_APPROVAL') {
				setCurrentStep('WAITING_APPROVAL');
				toast({
					title: 'Request Status',
					description: result.message || 'Waiting for host approval',
				});
			} else if (result.status === 'JOINED' && result.eventSlug) {
				setCurrentStep('REDIRECTING');
				toast({
					title: 'Success',
					description: result.message || 'Successfully joined the event',
				});
				handleRedirectToEvent(result.eventSlug);
			} else if (result.status === 'NOT_JOINED' && result.eventSlug) {
				//Let handle the case of a public event and a user tries to join but their current status is not joined yet. let join them to the event and redirect them to the event page
			}

			console.log({ result });
		} else {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: result.error || 'Failed to join event',
			});
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
				<DialogTitle>
					{currentStep === 'PIN_ENTRY'
						? 'Enter Event PIN'
						: currentStep === 'WAITING_APPROVAL'
							? 'Request Pending'
							: currentStep === 'REDIRECTING'
								? 'Success!'
								: 'Join Event'}
				</DialogTitle>
			</DialogHeader>
			{renderContent()}
		</>
	);
}
