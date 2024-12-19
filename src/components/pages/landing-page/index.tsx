import AboutUsSection from '@/components/marketing/about-us';
import EventsSection from '@/components/marketing/events';
import Footer from '@/components/marketing/footer';
import HeroSection from '@/components/marketing/hero';
import JoinUsSection from '@/components/marketing/join-us';
import React from 'react';

const LandingPage = () => {
	return (
		<main className='bg-[#FCFBF7]'>
			<HeroSection />
			<AboutUsSection />
			<JoinUsSection />
			<EventsSection />
			<Footer />
		</main>
	);
};

export default LandingPage;
