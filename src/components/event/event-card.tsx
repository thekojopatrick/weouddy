'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { MapPin, Share2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventCardShimmer } from './shimmer-loading';
import EventModal from './event-modal';
import Image from 'next/image';
import { getNameInitials } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce'; // Path to your useDebounce hook
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
	id: string;
	name: string;
	type: string;
	coverImage: string | null;
	isPrivate: boolean;
	isDisabled: boolean;
	requiresApproval: boolean;
	accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
	host: {
		id: string;
		name: string;
		username: string | null;
		avatarUrl: string | null;
	};
	location: string;
	members: number;
	category: string;
	date: string;
	time: string;
	description: string;
	additionalInfo?: string;
	slug: string | null;
	memberCount: number;
	attendeeCount: number;
}

export function EventCard({
	id,
	name,
	type,
	coverImage,
	isPrivate,
	host,
	location,
	members,
	category,
	date,
	time,
	description,
	additionalInfo,
	slug,
	accessType,
	memberCount,
	attendeeCount,
	isDisabled,
	requiresApproval,
}: EventCardProps) {
	const [isCheckingStatus, setIsCheckingStatus] = useState(false);
	const debouncedCheckingStatus = useDebounce(isCheckingStatus, 300); // Debounce state with 300ms delay
	const [userStatus, setUserStatus] = useState<
		'NOT_JOINED' | 'PENDING' | 'JOINED'
	>('NOT_JOINED');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const [city, country] = location.split(', ');

	useEffect(() => {
		const fetchUserStatus = async () => {
			try {
				const response = await fetch(`/api/events/${id}/status`);
				const data = await response.json();
				setUserStatus(data.status);
			} catch (error) {
				console.error('Failed to fetch user status:', error);
			}
		};

		if (debouncedCheckingStatus) {
			fetchUserStatus();
		}
	}, [id, debouncedCheckingStatus]);

	const handleShare = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const eventUrl = `${window.location.origin}/events/${slug}`;

		try {
			if (navigator.share) {
				await navigator.share({
					title: name,
					text: `Check out this event: ${name}`,
					url: eventUrl,
				});
			} else {
				copyToClipboard(eventUrl);
			}
		} catch (err) {
			console.error('Failed to share event:', err);
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

	const handleCardClick = () => {
		setIsCheckingStatus(true);

		if (userStatus === 'JOINED') {
			// Navigate to the event page
			router.push(`/events/${slug}`);
		} else {
			setIsCheckingStatus(false);
			// Open modal for join flow
			setIsModalOpen(true);
		}
	};

	if (debouncedCheckingStatus) {
		return <EventCardShimmer />;
	}

	return (
		<div>
			<Card
				className='group relative overflow-hidden cursor-pointer shadow-none hover:shadow-md transition-shadow'
				onClick={handleCardClick}
			>
				<CardHeader className='p-0'>
					<div className='relative aspect-[4/3]'>
						<Badge variant='secondary' className='absolute left-4 top-4 z-10'>
							{isPrivate ? 'Private' : 'Public'}
						</Badge>
						<Button
							variant='secondary'
							size='icon'
							className='absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity'
							onClick={handleShare}
						>
							<Share2 className='h-4 w-4' />
						</Button>
						<Image
							src={coverImage ?? '/place-holder.svg'}
							alt={`Event ${name}`}
							fill
							className='object-cover transition-transform group-hover:scale-105'
						/>
					</div>
				</CardHeader>
				<CardContent className='flex items-center gap-2.5 p-4'>
					<h3 className='font-semibold leading-none tracking-tight max-w-40 truncate'>
						{name}
					</h3>
					<div className='flex flex-wrap gap-2'>
						<Badge variant='outline' className='capitalize'>
							{type}
						</Badge>
						<Badge variant='outline' className='hidden'>
							{category}
						</Badge>
					</div>
				</CardContent>
				<CardFooter className='p-4 pt-0'>
					<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
						<div className='row flex gap-2'>
							<div className='col-auto'>
								<Avatar className='h-10 w-10'>
									<AvatarImage
										src={
											host.avatarUrl ??
											`https://avatar.vercel.sh/${host.id}.svg?text=${getNameInitials(host.name)}` ??
											undefined
										}
									/>
									<AvatarFallback>{host.name[0]}</AvatarFallback>
								</Avatar>
							</div>
							<div className='col-auto'>
								<div className='font-medium text-zinc-950'>{host.name}</div>
								<div className='row flex items-center gap-2 -mx-1'>
									<div className='flex items-center space-x-1'>
										<MapPin className='size-4' />
										<span className='truncate max-w-20'>{location}</span>
									</div>
									<div className='flex items-center space-x-1'>
										<Users className='size-4' />
										<span>{members}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardFooter>
			</Card>
			{userStatus !== 'JOINED' && (
				<EventModal
					isOpen={isModalOpen}
					onCloseAction={() => setIsModalOpen(false)}
					event={{
						id,
						name,
						type,
						coverImage: coverImage ?? '/place-holder.svg',
						host,
						date,
						time,
						location: {
							name: location,
							city: city || 'Unknown',
							country: country || 'Unknown',
						},
						isPrivate,
						isDisabled,
						requiresApproval,
						accessType,
						members,
						description,
						additionalInfo,
						slug,
						memberCount,
						attendeeCount,
					}}
					userStatus={userStatus}
				/>
			)}
		</div>
	);
}
