import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Lock, MessageCircle, UserCheck } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { EventWithDetails } from '@/types/prisma.types';
import { Switch } from '@/components/ui/switch';

type EventSettingsModalProps = {
	event: EventWithDetails;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSaveSettings: (settings: Partial<EventWithDetails>) => void;
};

export function EventSettingsModal({
	event,
	isOpen,
	onOpenChange,
	onSaveSettings,
}: EventSettingsModalProps) {
	const [settings, setSettings] = useState({
		isPrivate: event.isPrivate,
		requiresApproval: event.requiresApproval,
		allowComments: event.allowComments,
		allowLikes: event.allowLikes,
		allowChat: event.allowChat,
		allowPosts: event.allowPosts,
	});

	const handleSave = () => {
		onSaveSettings(settings);
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Event Settings</DialogTitle>
					<DialogDescription>
						Customize your event&apos;s privacy and interaction settings
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Lock className='h-5 w-5' />
							<span>Private Event</span>
						</div>
						<Switch
							checked={settings.isPrivate}
							onCheckedChange={(checked) =>
								setSettings((prev) => ({ ...prev, isPrivate: checked }))
							}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<UserCheck className='h-5 w-5' />
							<span>Requires Approval</span>
						</div>
						<Switch
							checked={settings.requiresApproval}
							onCheckedChange={(checked) =>
								setSettings((prev) => ({ ...prev, requiresApproval: checked }))
							}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<MessageCircle className='h-5 w-5' />
							<span>Allow Comments</span>
						</div>
						<Switch
							checked={settings.allowComments}
							onCheckedChange={(checked) =>
								setSettings((prev) => ({ ...prev, allowComments: checked }))
							}
						/>
					</div>

					{/* Similar switches for other settings */}
				</div>

				<div className='mt-4 flex justify-end space-x-2'>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Changes</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
