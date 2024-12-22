'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile } from 'lucide-react';

const allEmojis = [
	'😀',
	'😂',
	'😍',
	'🤔',
	'😎',
	'👍',
	'❤️',
	'🔥',
	'🎉',
	'👏',
	'🌟',
	'🍕',
	'🎸',
	'🚀',
	'🌈',
	'🦄',
	'🍦',
	'🎭',
	'🌺',
	'🐶',
];

interface EmojiPickerProps {
	onEmojiSelectAction: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelectAction }: EmojiPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');

	const filteredEmojis = useMemo(() => {
		return allEmojis.filter((emoji) => emoji.includes(search));
	}, [search]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant='ghost' size='icon'>
					<Smile className='h-5 w-5' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-64 p-2'>
				<Input
					placeholder='Search emoji...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='mb-2'
				/>
				<div className='grid grid-cols-5 gap-2'>
					{filteredEmojis.map((emoji) => (
						<Button
							key={emoji}
							variant='ghost'
							className='h-10 w-10'
							onClick={() => {
								onEmojiSelectAction(emoji);
								setIsOpen(false);
							}}
						>
							{emoji}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
