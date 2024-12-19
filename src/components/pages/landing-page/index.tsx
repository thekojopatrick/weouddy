import AboutUsSection from '@/components/marketing/about-us';
import HeroSection from '@/components/marketing/hero';
import JoinUsSection from '@/components/marketing/join-us';
import React from 'react';

const LandingPage = () => {
	return (
		<div className='bg-[#FCFBF7]'>
			<HeroSection />
			<AboutUsSection />
			<JoinUsSection />
			<div className='span'>Upcoming Events/Past Events</div>
			<div className='span'>Contact Us</div>
		</div>
	);
};

export default LandingPage;
