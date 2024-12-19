import Image from 'next/image';
import React from 'react';
import { TextEffect } from '@/components/ui/text-effect';
const AboutUsSection = () => {
	return (
		<section className='flex flex-col w-full justify-center items-center py-12 pb-20 md:py-16'>
			<div className='flex flex-col gap-8 max-w-2xl my-5 mb-10 md:my-20'>
				<h1 className='text-xl font-semibold text-center tracking-tight'>
					<TextEffect
						className='font-display mr-1'
						as='span'
						per='char'
						delay={0.5}
						variants={{
							container: {
								hidden: {
									opacity: 0,
								},
								visible: {
									opacity: 1,
									transition: {
										staggerChildren: 0.05,
									},
								},
							},
							item: {
								hidden: {
									opacity: 0,
									rotateX: 90,
									y: 10,
								},
								visible: {
									opacity: 1,
									rotateX: 0,
									y: 0,
									transition: {
										duration: 0.2,
									},
								},
							},
						}}
					>
						WeOuddy
					</TextEffect>
					<TextEffect as='span' per='char' delay={1.5}>
						connects people to moments instead of events
					</TextEffect>
				</h1>
				<TextEffect
					per='char'
					delay={2.5}
					className='text-xl font-semibold text-center tracking-tight'
					preset='blur'
				>
					it’s a new way to get informations, memories about events, businesses
					, startups & creatives
				</TextEffect>
			</div>
			<div className='flex flex-col gap-6 max-w-4xl mt-6'>
				<TextEffect
					as='h2'
					per='char'
					delay={2.5}
					className='text-xl font-display text-center tracking-normal'
					preset='blur'
				>
					See us in action
				</TextEffect>

				<div className='flex gap-3'>
					<Image
						src='/images/social-post-1.png'
						alt='WeOuddy instagram social post'
						className='w-40 md:w-64 h-full object-cover animate-in fade-in slide-in-from-bottom-3 duration-500'
						width={600}
						height={600}
					/>
					<Image
						src='/images/social-post-2.png'
						alt='WeOuddy instagram social post'
						className='w-40 md:w-64 h-full object-cover animate-in fade-in slide-in-from-bottom-5 duration-500'
						width={600}
						height={600}
					/>
				</div>
			</div>
		</section>
	);
};

export default AboutUsSection;
