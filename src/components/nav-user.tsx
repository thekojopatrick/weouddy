'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar);

	useEffect(() => {
		async function downloadImage(path: string) {
			try {
				const { data, error } = await supabase.storage
					.from('avatars')
					.download(path);

				if (error) {
					throw error;
				}

				const url = URL.createObjectURL(data);
				setAvatarUrl(url);
			} catch (error) {
				console.log('Error downloading image: ', error);
			}
		}

		if (user) downloadImage(user.avatar);
	}, [user]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className='h-8 w-8 rounded-full'>
					<AvatarImage src={avatarUrl!} alt={user.name} />
					<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
				side={'bottom'}
				align='end'
				sideOffset={4}
			>
				<DropdownMenuLabel className='p-0 font-normal'>
					<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
						<Avatar className='h-8 w-8 rounded-lg'>
							<AvatarImage src={avatarUrl!} alt={user.name} />
							<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
						</Avatar>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-semibold'>{user.name}</span>
							<span className='truncate text-xs'>{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Sparkles />
						Upgrade to Pro
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheck />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<form action='/auth/signout' method='post'>
						<button className='flex gap-2 items-center' type='submit'>
							<LogOut className='size-4' />
							Log out
						</button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
