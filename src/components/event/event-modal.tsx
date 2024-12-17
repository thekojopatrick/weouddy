'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, MoreVertical, Users } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EventModalProps {
	isOpen: boolean;
	onCloseAction: () => void;
	event: {
		name: string;
		type: string;
		coverImage: string | null;
		host: {
			name: string;
			avatarUrl: string;
		};
		date: string;
		time: string;
		location: {
			name: string;
			city: string;
			country: string;
		};
		members: number;
		description: string;
		additionalInfo?: string;
	};
}

export function EventModal({ isOpen, onCloseAction, event }: EventModalProps) {
	const [isMobile, setIsMobile] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleJoinRequest = () => {
		router.push(`/events/${event.name.toLowerCase().replace(/ /g, '-')}`);
	};

	return (
		<Sheet open={isOpen} onOpenChange={onCloseAction}>
			<SheetContent
				side={isMobile ? 'bottom' : 'right'}
				className={`w-full ${isMobile ? 'h-[90vh] rounded-t-[10px]' : 'max-w-xl'}`}
			>
				<div className='relative h-48 -mx-6 -mt-2'>
					<Image
						src={event.coverImage ?? '/placeholder.svg'}
						alt={event.name}
						fill
						className='object-cover'
					/>
					<Button
						variant='ghost'
						size='icon'
						className='absolute top-4 right-4 bg-background/80 backdrop-blur-sm'
					>
						<MoreVertical className='h-4 w-4' />
					</Button>
				</div>

				<div className='space-y-6 mt-6 mb-auto md:h-[56vh]'>
					<div>
						<Badge variant={'secondary'}>{event.type}</Badge>
						<h2 className='text-2xl font-bold mt-2'>{event.name}</h2>
						<div className='flex items-center gap-2 mt-2'>
							<Avatar className='h-6 w-6'>
								<AvatarImage src={event.host.avatarUrl} />
								<AvatarFallback>{event.host.name[0]}</AvatarFallback>
							</Avatar>
							<span className='text-sm text-muted-foreground'>
								Hosted By {event.host.name}
							</span>
						</div>
					</div>

					<div className='space-y-4'>
						<div className='flex items-center gap-4'>
							<Calendar className='h-5 w-5 text-muted-foreground' />
							<div>
								<div className='font-medium'>{event.date}</div>
								<div className='text-sm text-muted-foreground'>
									{event.time}
								</div>
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
				<SheetFooter className='mt-auto'>
					<div className='space-y-2'>
						<p className='text-sm text-center'>
							Please welcome to join the room. You will be notified if host
							accepts your request.
						</p>
						<Button className='w-full' onClick={handleJoinRequest}>
							Request to Join
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
