'use client';

import { Button } from '@/components/ui/button';
import { FollowButtonProps } from '@/server/actions/user/types';
import { useState } from 'react';

export default function FollowButton({
	isFollowing: initialIsFollowing,

	onToggle,
	size = 'sm',
	disabled = false,
}: FollowButtonProps) {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [isHovering, setIsHovering] = useState(false);

	const handleToggle = async () => {
		setIsFollowing(!isFollowing);
		onToggle();
	};

	return (
		<Button
			size={size}
			variant={isFollowing ? 'outline' : 'default'}
			onClick={handleToggle}
			disabled={disabled}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			className='min-w-[90px] flex items-center gap-1'
		>
			{isFollowing ? (isHovering ? 'Unfollow' : 'Following') : 'Remove'}
		</Button>
	);
}
