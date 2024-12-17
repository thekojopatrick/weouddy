'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EventModal } from './event-modal';
import Image from 'next/image';
import { useState } from 'react';

interface EventCardProps {
	name: string;
	type: string;
	coverImage: string | null;
	isPrivate: boolean;
	host: {
		name: string;
		avatarUrl: string;
	};
	location: string;
	members: number;
	category: string;
	date: string;
	time: string;
	description: string;
	additionalInfo?: string;
}

export function EventCard({
	name,
	type,
	coverImage,
	isPrivate,
	host,
	location = 'Accra,Ghana',
	members,
	category,
	date,
	time,
	description,
	additionalInfo,
}: EventCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [city, country] = location.split(', ');

	return (
		<>
			<Card
				className='overflow-hidden cursor-pointer shadow-sm'
				onClick={() => setIsModalOpen(true)}
			>
				<CardHeader className='p-0'>
					<div className='relative aspect-[4/3]'>
						<Badge variant={'secondary'} className='absolute left-4 top-4 z-10'>
							{!isPrivate ? 'Public' : 'Private'}
						</Badge>
						<Image
							src={coverImage ?? '/place-holder.svg'}
							alt={`Event ${name}`}
							fill
							className='object-cover'
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
								<AvatarImage src={host.avatarUrl} />
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
					name,
					type,
					coverImage: coverImage ?? '/place-holder.svg',
					host,
					date,
					time,
					location: {
						name: location,
						city,
						country,
					},
					members,
					description,
					additionalInfo,
				}}
			/>
		</>
	);
}
