'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	getEventJoinInfo,
	joinEvent,
} from '@/server/actions/event/join/mutation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import JoinEventSuccess from './forms/success';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import { QRScannerForm } from './forms/qr-scanner-form';
import { extractIdentifierFromLink } from '@/lib/utils';
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
	const redirectTimeoutRef = useRef<NodeJS.Timeout>(null);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (redirectTimeoutRef.current) {
				clearTimeout(redirectTimeoutRef.current);
			}
		};
	}, []);

	const handleRedirectToEvent = useCallback(
		(slug: string) => {
			if (!slug || !isRedirecting) return;
			onCloseDialog?.();
			router.push(`/events/${slug}`);
		},
		[onCloseDialog, router, isRedirecting]
	);

	const handleJoinResult = useCallback(
		async (result: {
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
						setIsRedirecting(true);
						toast({
							title: 'Success',
							description: result.message || 'Successfully joined the event',
						});
						// Store timeout reference so we can cancel it
						redirectTimeoutRef.current = setTimeout(() => {
							if (isRedirecting) {
								// Only redirect if not cancelled
								handleRedirectToEvent(result.eventSlug!);
							}
						}, 1500);
					}
					break;

				case 'NOT_JOINED':
					if (result.eventSlug && eventData && !eventData.isPrivate) {
						const joinResult = await joinEvent({
							identifier: eventData.id,
							identifierType: 'id',
						});
						handleJoinResult(joinResult as never);
					}
					break;
			}
		},
		[eventData, handleRedirectToEvent, toast, isRedirecting]
	);

	const handleEventAccess = useCallback(
		async (identifier: string, pin?: string) => {
			setIsLoading(true);
			try {
				const eventInfo = await getEventJoinInfo(identifier);

				if (!eventInfo.success || !eventInfo.event) {
					throw new Error(eventInfo.error || 'Failed to fetch event');
				}

				setEventData(eventInfo.event as never);

				if (eventInfo.userStatus === 'JOINED') {
					setCurrentStep('REDIRECTING');
					setIsRedirecting(true);
					redirectTimeoutRef.current = setTimeout(() => {
						if (isRedirecting) {
							// Only redirect if not cancelled
							handleRedirectToEvent(eventInfo.event.slug);
						}
					}, 500);
					return;
				}

				if (eventInfo.userStatus === 'PENDING') {
					setCurrentStep('WAITING_APPROVAL');
					return;
				}

				const event = eventInfo.event;

				if (!event.isPrivate) {
					console.log('Redirecting 1');
					setCurrentStep('REDIRECTING');
					setIsRedirecting(true);

					const result = await joinEvent({
						identifier,
						identifierType: /^c[a-zA-Z0-9]{24}$/.test(identifier)
							? 'id'
							: 'slug',
					});

					if (result.success) {
						setTimeout(() => {
							handleRedirectToEvent(event.slug);
						}, 500);
					} else {
						throw new Error(result.error || 'Failed to join event');
					}
					return;
				}

				if (event.accessType === 'PIN_REQUIRED' && !pin) {
					setCurrentStep('PIN_ENTRY');
					return;
				}

				const result = await joinEvent({
					identifier,
					identifierType: /^c[a-zA-Z0-9]{24}$/.test(identifier) ? 'id' : 'slug',
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
			} finally {
				setIsLoading(false);
			}
		},
		[handleJoinResult, handleRedirectToEvent, toast, isRedirecting]
	);

	useEffect(() => {
		if (initialStep === 'REDIRECTING' && initialEventData?.id) {
			handleEventAccess(initialEventData.id);
		}
	}, [initialStep, initialEventData, handleEventAccess]);

	const handleLinkSubmit = useCallback(
		async (link: string) => {
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
		},
		[handleEventAccess]
	);

	const handlePinSubmit = useCallback(
		async (pin: string) => {
			setIsLoading(true);
			try {
				if (!eventData?.id) {
					throw new Error('Event data not found');
				}
				await handleEventAccess(eventData.id, pin);
			} finally {
				setIsLoading(false);
			}
		},
		[eventData?.id, handleEventAccess]
	);

	const handleCancelRedirect = () => {
		if (redirectTimeoutRef.current) {
			clearTimeout(redirectTimeoutRef.current);
		}
		setIsRedirecting(false);
		setCurrentStep('LINK_PASTE');
		onCloseDialog?.();
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
						onScanCompleteAction={handleLinkSubmit}
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
					<div className='relative space-y-4'>
						<JoinEventSuccess
							isLoading={isLoading}
							onManualRedirect={() =>
								eventData?.slug && handleRedirectToEvent(eventData.slug)
							}
						/>
						{isRedirecting && (
							<Button
								variant='secondary'
								className='w-full'
								onClick={handleCancelRedirect}
							>
								Cancel
							</Button>
						)}
					</div>
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
								? undefined
								: 'Ready to join an event'}
				</DialogTitle>
			</DialogHeader>
			<div className='py-4'>{renderContent()}</div>
		</>
	);
}
