import Image from 'next/image';
import JoinWaitList from './join-waitlist';
import React from 'react';

const JoinUsSection = () => {
	return (
		<section className='flex w-full justify-center items-center py-20 md:py-16 px-6 bg-black'>
			<div className='max-w-6xl flex flex-wrap gap-20 items-center'>
				<div className='flex flex-col gap-6 max-w-md'>
					<Image
						src='/images/fun-people-1.png'
						alt='WeOuddy instagram social post'
						className='w-full h-full object-cover'
						width={600}
						height={600}
					/>
				</div>
				<div className='flex flex-col gap-6 md:my-20 max-w-md justify-start items-start'>
					<div className='space-y-6 text-white'>
						<h2 className='text-6xl font-display tracking-tight text-left text-[#efcc4e]'>
							Show them something
						</h2>
						<p className='tracking-tight'>
							You don’t have to try hard on{' '}
							<span className='font-display'>WeOuddy</span> . There’s no
							pressure or need to take it seriously. Just chillax kick back and
							show them.
						</p>
						<p className='tracking-tight'>
							”We dey outside nor be convention”- Kojo manuel (creator of the
							word (we oudy)).
						</p>
					</div>
					<JoinWaitList />
				</div>
			</div>
		</section>
	);
};

export default JoinUsSection;
