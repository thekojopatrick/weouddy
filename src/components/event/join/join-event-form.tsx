'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { EventData } from '@/types/event';
import { LinkPasteForm } from './forms/link-paste-form';
import { PinEntryForm } from './forms/pin-entry-form';
import { QRScannerForm } from './forms/qr-scanner-form';
import { useState } from 'react';

type JoinStep =
	| 'LINK_PASTE'
	| 'QR_SCAN'
	| 'PIN_ENTRY'
	| 'WAITING_APPROVAL'
	| 'SUCCESS';

interface JoinEventDialogProps {
	// isOpen: boolean;
	// onCloseAction: () => void;
	initialStep?: JoinStep;
	event?: EventData; // Optional - only needed when accessing directly via link
}

export function JoinEventForm({
	initialStep = 'LINK_PASTE',
	event,
}: JoinEventDialogProps) {
	const [currentStep, setCurrentStep] = useState<JoinStep>(initialStep);
	const [isLoading, setIsLoading] = useState(false);
	const [eventData, setEventData] = useState<EventData | undefined>(event);

	const handleLinkSubmit = async (link: string) => {
		setIsLoading(true);
		try {
			// Simulate API call to fetch event data
			await new Promise((resolve) => setTimeout(resolve, 1500));
			const mockEvent: EventData = {
				id: '123',
				name: 'Birthday Party',
				description: 'A fun birthday party!',
				createdAt: new Date().toISOString() as never,
				updatedAt: new Date().toISOString() as never,
				isPrivate: true,
				requiresApproval: false,
				accessType: 'PIN_REQUIRED',
				pinCode: '123456',
			};
			setEventData(mockEvent);

			console.log({ link });

			if (mockEvent.isPrivate && mockEvent.accessType === 'PIN_REQUIRED') {
				setCurrentStep('PIN_ENTRY');
			} else if (mockEvent.requiresApproval) {
				setCurrentStep('WAITING_APPROVAL');
			} else {
				setCurrentStep('SUCCESS');
			}
		} catch (error) {
			// Handle error
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePinSubmit = async (pin: string) => {
		setIsLoading(true);
		try {
			// Validate PIN against event data
			if (eventData?.pinCode !== pin) {
				throw new Error('Invalid PIN code');
			}

			await new Promise((resolve) => setTimeout(resolve, 1500));

			if (eventData?.requiresApproval) {
				setCurrentStep('WAITING_APPROVAL');
			} else {
				setCurrentStep('SUCCESS');
			}
		} catch (error) {
			// Show error in the PIN form
			setCurrentStep('PIN_ENTRY');
			if (error instanceof Error) {
				// You might want to pass this error to the PinEntryForm
				console.error(error.message);
			}
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

			case 'SUCCESS':
				return (
					<Alert>
						<AlertDescription>
							Successfully joined the event! Redirecting to event room...
						</AlertDescription>
					</Alert>
				);
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{currentStep === 'PIN_ENTRY' ? 'Enter Event PIN' : 'Join Event'}
				</DialogTitle>
			</DialogHeader>
			{renderContent()}
		</>
	);
}
