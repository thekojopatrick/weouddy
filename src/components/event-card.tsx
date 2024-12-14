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
	title: string;
	type: string;
	image: string;
	isPublic: boolean;
	host: {
		name: string;
		avatar: string;
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
	title,
	type,
	image,
	isPublic,
	host,
	location,
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
				className='overflow-hidden cursor-pointer'
				onClick={() => setIsModalOpen(true)}
			>
				<CardHeader className='p-0'>
					<div className='relative aspect-[4/3]'>
						<Badge
							variant={isPublic ? 'secondary' : 'outline'}
							className='absolute left-4 top-4 z-10'
						>
							{isPublic ? 'Public' : 'Private'}
						</Badge>
						<Image src={image} alt={title} fill className='object-cover' />
					</div>
				</CardHeader>
				<CardContent className='grid gap-2.5 p-4'>
					<h3 className='font-semibold leading-none tracking-tight'>{title}</h3>
					<div className='flex flex-wrap gap-2'>
						<Badge variant='secondary'>{type}</Badge>
						<Badge variant='outline'>{category}</Badge>
					</div>
				</CardContent>
				<CardFooter className='p-4 pt-0'>
					<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
						<div className='flex items-center space-x-2'>
							<Avatar className='h-8 w-8'>
								<AvatarImage src={host.avatar} />
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
					title,
					type,
					coverImage: image,
					host,
					date,
					time,
					location: {
						name: 'East Legon hills',
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
