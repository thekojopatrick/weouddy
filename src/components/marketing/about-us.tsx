import Image from 'next/image';
import React from 'react';
const AboutUsSection = () => {
	return (
		<section className='flex flex-col w-full justify-center items-center py-16'>
			<div className='flex flex-col gap-8 max-w-2xl my-20'>
				<h1 className='text-xl font-semibold text-center tracking-tight'>
					<span className='font-display'>WeOuddy</span> connects people to
					moments instead of events
				</h1>
				<p className='text-xl font-semibold text-center tracking-tight'>
					it’s a new way to get informations, memories about events, businesses
					, startups & creatives
				</p>
			</div>
			<div className='flex flex-col gap-6 max-w-4xl mt-6'>
				<h2 className='text-xl font-display text-center tracking-normal'>
					See us in action
				</h2>
				<div className='flex gap-3'>
					<Image
						src='/images/social-post-1.png'
						alt='WeOuddy instagram social post'
						className='w-64 h-full object-cover'
						width={600}
						height={600}
					/>
					<Image
						src='/images/social-post-2.png'
						alt='WeOuddy instagram social post'
						className='w-64 h-full object-cover'
						width={600}
						height={600}
					/>
				</div>
			</div>
		</section>
	);
};

export default AboutUsSection;
