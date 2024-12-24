'use client';

import { Button, LoadingButton } from '../ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';

import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

const COMPANY_EMAIL = 'hello.weouddy@gmail.com';
const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
	const [copyState, setCopyState] = React.useState({
		isCopying: false,
		isError: false,
	});

	const copyTimeoutRef = React.useRef<NodeJS.Timeout>(null);

	const copyToClipboard = async () => {
		if (copyState.isCopying) return;

		setCopyState({ isCopying: true, isError: false });

		try {
			await navigator.clipboard.writeText(COMPANY_EMAIL);

			toast('Email copied!', {
				description: 'Email address has been copied to clipboard',
			});

			// Clear any existing timeout
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}

			// Reset state after 2 seconds
			copyTimeoutRef.current = setTimeout(() => {
				setCopyState({ isCopying: false, isError: false });
			}, 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
			setCopyState({ isCopying: false, isError: true });

			toast('Failed to copy', {
				description: 'Please try again or copy manually',
			});
		}
	};

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}
		};
	}, []);

	return (
		<footer
			className='flex flex-col w-full justify-center items-center py-16 px-6 bg-black'
			role='contentinfo'
		>
			<div className='max-w-6xl flex flex-col items-center gap-10 justify-center mb-10'>
				<div className='relative w-24 h-24'>
					<Image
						src='/brand/logomark-white-black-short.png'
						alt='WeOuddy logo'
						className='object-contain'
						fill
						priority
						sizes='(max-width: 80px) 100vw, 80px'
					/>
				</div>

				<div className='flex flex-col gap-6 max-w-md justify-center items-center'>
					<div className='space-y-10 text-center'>
						<div className='space-y-2'>
							<h2 className='text-4xl md:text-6xl font-display tracking-tight text-[#efcc4e] animate-in fade-in slide-in-from-bottom-3 duration-500'>
								We dey outside
							</h2>
							<p className='text-white animate-in fade-in slide-in-from-bottom-4 duration-700'>
								Let us know the occasion—send the location, and let&apos;s make
								it a moment to remember!
							</p>
						</div>

						<div className='flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-5 duration-1000'>
							<LoadingButton
								variant='outline'
								size='lg'
								className='rounded-full w-auto group'
								onClick={copyToClipboard}
								loading={copyState.isCopying}
								aria-label={
									copyState.isCopying
										? 'Copying email address'
										: 'Copy email address'
								}
							>
								{copyState.isCopying ? (
									<>
										<CheckIcon className='mr-2 h-4 w-4' />
										Copied!
									</>
								) : (
									<>
										<CopyIcon className='mr-2 h-4 w-4 group-hover:scale-110 transition-transform' />
										Contact us
									</>
								)}
							</LoadingButton>

							<Button
								variant='outline'
								size='lg'
								className='rounded-full hidden w-auto bg-[#efcc4e] border-[#efcc4e] hover:bg-[#e5c23d] hover:border-[#e5c23d] transition-colors'
								onClick={() => window.open('/sponsor', '_blank')}
								aria-label='Open sponsorship page'
							>
								Sponsor us
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className='w-full mt-10 text-center'>
				<span className='text-gray-300 font-display text-center'>
					WeOuddy ©{CURRENT_YEAR}
				</span>
			</div>
		</footer>
	);
};

export default Footer;
