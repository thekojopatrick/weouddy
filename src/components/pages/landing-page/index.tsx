import AboutUsSection from '@/components/marketing/about-us';
import HeroSection from '@/components/marketing/hero';
import React from 'react';

const LandingPage = () => {
	return (
		<div className='bg-[#FCFBF7]'>
			<HeroSection />
			<AboutUsSection />
			<div className='span font-display'>Services</div>
			<div className='span'>Upcoming Events/Past Events</div>
			<div className='span'>Contact Us</div>
		</div>
	);
};

export default LandingPage;
