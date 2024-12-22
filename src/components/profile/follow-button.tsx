import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FollowButtonProps {
	isFollowing: boolean;
	onToggle: () => void;
	size?: 'default' | 'sm' | 'lg' | 'icon';
	disabled?: boolean;
}

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
			className='min-w-[90px]'
		>
			{isFollowing ? (isHovering ? 'Unfollow' : 'Following') : 'Follow'}
		</Button>
	);
}
