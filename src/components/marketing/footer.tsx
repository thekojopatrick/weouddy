import { Button } from '../ui/button';
import { CopyIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Footer = () => {
	return (
		<footer className='flex flex-col w-full justify-center items-center py-16 px-6 bg-black'>
			<div className='max-w-6xl flex flex-col items-center gap-10 justify-center mb-10'>
				<Image
					src='/brand/logomark-white-black-short.png'
					alt='WeOuddy logo mark'
					className='w-20 h-full object-cover'
					width={200}
					height={200}
				/>
				<div className='flex flex-col gap-6 max-w-md justify-center items-center'>
					<div className='space-y-10 text-center'>
						<div className='space-y-2'>
							<h2 className='text-6xl font-display tracking-tight text-[#efcc4e]'>
								You dey outside
							</h2>
							<p className='text-white'>
								then me make we know the occasion, send location!.
							</p>
						</div>
						<Button
							variant='outline'
							size={'lg'}
							className='rounded-full w-auto'
						>
							<CopyIcon />
							Contact us
						</Button>
					</div>
				</div>
			</div>
			<div className='w-full mt-10 text-center'>
				<span className='text-gray-300 font-display text-center'>
					WeOuddy ©2024
				</span>
			</div>
		</footer>
	);
};

export default Footer;
