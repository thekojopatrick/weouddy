'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { MapPin, Share2, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventModal } from './event-modal';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
	id: string;
	name: string;
	type: string;
	coverImage: string | null;
	isPrivate: boolean;
	isDisabled: boolean;
	requiresApproval: boolean;
	host: {
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
	memberCount,
	attendeeCount,
	isDisabled,
	requiresApproval,
}: EventCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { toast } = useToast();
	const [city, country] = location.split(', ');

	const handleShare = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const eventUrl = `${window.location.origin}/events/${slug}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: name,
					text: `Check out this event: ${name}`,
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

	return (
		<div>
			<Card
				className='group relative overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow'
				onClick={() => setIsModalOpen(true)}
			>
				<CardHeader className='p-0'>
					<div className='relative aspect-[4/3]'>
						<Badge variant='secondary' className='absolute left-4 top-4 z-10'>
							{!isPrivate ? 'Public' : 'Private'}
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
				<CardContent className='grid gap-2.5 p-4'>
					<h3 className='font-semibold leading-none tracking-tight'>{name}</h3>
					<div className='flex flex-wrap gap-2'>
						<Badge variant='secondary' className='capitalize'>
							{type}
						</Badge>
						<Badge variant='outline'>{category}</Badge>
					</div>
				</CardContent>
				<CardFooter className='p-4 pt-0'>
					<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
						<div className='flex items-center space-x-2'>
							<Avatar className='h-8 w-8'>
								<AvatarImage src={host.avatarUrl ?? undefined} />
								<AvatarFallback>{host.name[0]}</AvatarFallback>
							</Avatar>
							<span>{host.name}</span>
						</div>
						<div className='flex items-center space-x-2'>
							<MapPin className='h-4 w-4' />
							<span>{location}</span>
						</div>
						<div className='flex items-center space-x-2'>
							<Users className='h-4 w-4' />
							<span>{members} members</span>
						</div>
					</div>
				</CardFooter>
			</Card>

			<EventModal
				isOpen={isModalOpen}
				onCloseAction={() => setIsModalOpen(false)}
				event={{
					id,
					name,
					type,
					coverImage: coverImage ?? '/place-holder.svg',
					host: {
						name: host.name,
						username: host.username ?? '',
						avatarUrl: host.avatarUrl ?? '',
					},
					date,
					time,
					location: {
						name: location,
						city: city || 'Unknown',
						country: country || 'Unknown',
					},
					isPrivate,
					members,
					description,
					additionalInfo,
					slug,
					memberCount,
					attendeeCount,
					isDisabled,
					requiresApproval,
				}}
			/>
		</div>
	);
}
