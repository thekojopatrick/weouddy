'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FollowRequest } from '@/server/actions/user/types';
import { fetchFollowRequests } from '@/server/actions/user/follow';
import { manageFollowRequest } from '@/server/actions/user/follow';
import { toast } from 'sonner';

// Props interface
interface FollowRequestsProps {
	userId: string;
}

// Action type for request handling
type RequestAction = 'accept' | 'decline';

export function FollowRequests({ userId }: FollowRequestsProps) {
	// Explicitly type the state
	const [requests, setRequests] = useState<FollowRequest[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Load requests function with proper typing
	const loadRequests = async () => {
		setIsLoading(true);
		try {
			const followRequests = await fetchFollowRequests(userId);
			setRequests(followRequests);
		} catch (error) {
			toast.error('Failed to load follow requests');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	// Use effect with dependency
	useEffect(() => {
		loadRequests();
	}, [userId]);

	// Handle request action with proper typing
	const handleRequestAction = async (
		requestId: string,
		action: RequestAction
	) => {
		try {
			await manageFollowRequest(requestId, action);

			// Remove the request from the list with type-safe filter
			setRequests((prev) => prev.filter((req) => req.id !== requestId));

			toast.success(`Request ${action}ed successfully`);
		} catch (error) {
			toast.error(`Failed to ${action} request`);
			console.error(error);
		}
	};

	// Render loading state if needed
	if (isLoading) {
		return (
			<div className='text-center py-10 text-muted-foreground'>
				Loading follow requests...
			</div>
		);
	}

	// No requests state
	if (requests.length === 0) {
		return (
			<div className='text-center py-10 text-muted-foreground'>
				No follow requests
			</div>
		);
	}

	// Main render
	return (
		<div className='container mx-auto px-4 py-6'>
			<h2 className='text-xl font-semibold mb-4'>
				Follow Requests ({requests.length})
			</h2>
			<div className='space-y-4'>
				{requests.map((request) => (
					<div
						key={request.id}
						className='flex items-center justify-between p-4 border rounded-lg'
					>
						<div className='flex items-center space-x-4'>
							<Avatar>
								<AvatarImage
									src={request.requestor.avatarUrl || '/placeholder.svg'}
									alt={`${request.requestor.name}'s avatar`}
								/>
								<AvatarFallback>
									{request.requestor.name?.[0] ?? '?'}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className='font-medium'>
									{request.requestor.name ?? 'Unknown'}
								</p>
								<p className='text-muted-foreground text-sm'>
									@{request.requestor.username ?? 'user'}
								</p>
							</div>
						</div>
						<div className='space-x-2'>
							<Button
								size='sm'
								onClick={() => handleRequestAction(request.id, 'decline')}
								variant='outline'
							>
								Decline
							</Button>
							<Button
								size='sm'
								onClick={() => handleRequestAction(request.id, 'accept')}
							>
								Accept
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
