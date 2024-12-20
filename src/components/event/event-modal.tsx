import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Share2, Users } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CustomSheet from '@/components/ui/custom-sheet';
import Image from 'next/image';
import JoinEventDialog from './join/join-event-dialog';
import { useToast } from '@/hooks/use-toast';

interface EventModalProps {
	isOpen: boolean;
	onCloseAction: () => void;
	event: {
		id: string;
		name: string;
		type: string;
		coverImage: string;
		host: {
			name: string;
			username: string | null;
			avatarUrl: string | null;
		};
		hostId?: string;
		dateTime?: string;
		date?: string;
		time?: string;
		location: {
			name: string;
			city: string;
			country: string;
		};
		isPrivate: boolean;
		isDisabled: boolean;
		requiresApproval: boolean;
		members: number;
		description: string;
		additionalInfo?: string;
		slug: string | null;
		memberCount: number;
		attendeeCount: number;
	};
	userStatus?: 'NOT_JOINED' | 'PENDING' | 'JOINED';
}

export function EventModal({
	isOpen,
	onCloseAction,
	event,
	userStatus = 'NOT_JOINED',
}: EventModalProps) {
	const [isMobile, setIsMobile] = useState(false);
	const [showJoinDialog, setShowJoinDialog] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleShare = async () => {
		const eventUrl = `${window.location.origin}/events/${event.slug}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: event.name,
					text: `Check out this event: ${event.name}`,
					url: eventUrl,
				});
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError') {
					copyToClipboard(eventUrl);
				}
			}
		} else {
			copyToClipboard(eventUrl);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: 'Link copied!',
			description: 'Event link has been copied to clipboard.',
		});
	};

	const getJoinButtonConfig = () => {
		if (userStatus === 'JOINED') {
			return {
				text: 'Already Joined',
				disabled: true,
				action: () => {},
			};
		}

		if (userStatus === 'PENDING') {
			return {
				text: 'Waiting for Approval',
				disabled: true,
				action: () => {},
			};
		}

		if (event.isPrivate && event.requiresApproval) {
			return {
				text: 'Request to Join',
				disabled: false,
				action: () => setShowJoinDialog(true),
			};
		}

		return {
			text: 'Join Room',
			disabled: false,
			action: () => setShowJoinDialog(true),
		};
	};

	const buttonConfig = getJoinButtonConfig();

	const renderContent = (
		<div className='flex flex-col space-y-6'>
			<div className='relative h-48'>
				<Image
					src={event.coverImage}
					alt={event.name}
					fill
					className='object-cover'
				/>
				<Button
					variant='secondary'
					size='icon'
					className='absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90'
					onClick={handleShare}
				>
					<Share2 className='h-4 w-4' />
				</Button>
			</div>

			<div className='px-6 space-y-6'>
				<div>
					<Badge variant='secondary'>{event.type}</Badge>
					<h2 className='text-2xl font-bold mt-2'>{event.name}</h2>
					<div className='flex items-center gap-2 mt-2'>
						<Avatar className='h-6 w-6'>
							<AvatarImage src={event.host.avatarUrl ?? ''} />
							<AvatarFallback>{event.host.name[0]}</AvatarFallback>
						</Avatar>
						<span className='text-sm text-muted-foreground'>
							Hosted by {event.host.name}
						</span>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='flex items-center gap-4'>
						<Calendar className='h-5 w-5 text-muted-foreground' />
						<div>
							<div className='font-medium'>{event.date}</div>
							<div className='text-sm text-muted-foreground'>{event.time}</div>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<MapPin className='h-5 w-5 text-muted-foreground' />
						<div>
							<div className='font-medium'>{event.location.name}</div>
							<div className='text-sm text-muted-foreground'>
								{event.location.city}, {event.location.country}
							</div>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<Users className='h-5 w-5 text-muted-foreground' />
						<div className='font-medium'>{event.members} members</div>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='font-semibold'>About event</h3>
					<p className='text-sm text-muted-foreground'>{event.description}</p>
				</div>

				{event.additionalInfo && (
					<div className='space-y-2'>
						<h3 className='font-semibold'>Additional information</h3>
						<p className='text-sm text-muted-foreground'>
							{event.additionalInfo}
						</p>
					</div>
				)}
			</div>
		</div>
	);

	const renderFooter = (
		<div className='w-full space-y-4'>
			<p className='text-sm text-center text-muted-foreground'>
				{userStatus === 'PENDING'
					? 'Your request is pending approval from the host.'
					: userStatus === 'JOINED'
						? 'You are a member of this event.'
						: 'Join this event to connect with other attendees and get updates.'}
			</p>
			<Button
				className='w-full'
				onClick={buttonConfig.action}
				disabled={buttonConfig.disabled}
			>
				{buttonConfig.text}
			</Button>
		</div>
	);

	return (
		<Fragment key={event.id}>
			<CustomSheet
				isOpen={isOpen}
				onCloseAction={onCloseAction}
				side={isMobile ? 'bottom' : 'right'}
				title={event.name}
				content={renderContent}
				stickyHeader={true}
				stickyFooter={true}
				scrollableContent={true}
				maxHeight={isMobile ? '90vh' : '80vh'}
				footerContent={renderFooter}
			/>
			<JoinEventDialog
				open={showJoinDialog}
				onOpenChangeAction={setShowJoinDialog}
				event={event as never}
				initialStep={
					event.isPrivate && event.requiresApproval ? 'PIN_ENTRY' : 'LINK_PASTE'
				}
			/>
		</Fragment>
	);
}
