import HeroSection from '@/components/marketing/hero-section';
import React from 'react';

const LandingPage = () => {
	return (
		<div>
			<HeroSection />
			<div className='span'>Hero Section</div>
			<div className='span'>About Us</div>
			<div className='span'>Services</div>
			<div className='span'>Upcoming Events/Past Events</div>
			<div className='span'>Contact Us</div>
		</div>
	);
};

export default LandingPage;
