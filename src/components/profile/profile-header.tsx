import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
	name: string;
	username: string;
	stats: {
		following: number;
		followers: number;
		events: number;
		posts: number;
	};
	isOwnProfile?: boolean;
}

export function ProfileHeader({
	name,
	username,
	stats,
	isOwnProfile = false,
}: ProfileHeaderProps) {
	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='flex flex-col items-center md:items-start md:flex-row md:gap-6'>
				<Avatar className='w-24 h-24 md:w-32 md:h-32'>
					<AvatarImage src='/placeholder.svg' />
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>

				<div className='mt-4 md:mt-0 flex-1'>
					<div className='text-center md:text-left'>
						<h1 className='text-2xl font-bold'>{name}</h1>
						<p className='text-muted-foreground'>{username}</p>
					</div>

					<div className='mt-4 flex justify-center md:justify-start gap-6 text-sm'>
						<div>
							<span className='font-medium'>{stats.following}</span>{' '}
							<span className='text-muted-foreground'>Following</span>
						</div>
						<div>
							<span className='font-medium'>{stats.followers}</span>{' '}
							<span className='text-muted-foreground'>Followers</span>
						</div>
					</div>
				</div>

				<div className='mt-4 md:mt-0 flex gap-2'>
					{isOwnProfile ? (
						<Button variant='outline'>Edit Profile</Button>
					) : (
						<Button>Follow</Button>
					)}
				</div>
			</div>
		</div>
	);
}
