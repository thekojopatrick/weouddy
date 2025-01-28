import React from 'react';
import { VideoShowcase } from '../_components/video-showcase';
import { TestimonialCard } from '../_components/testimonial-card';
import { FeaturesGrid } from '../_components/features-grid';
import Footer from '@/components/marketing/footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="max-w-3xl text-left mb-24">
          <h1 className="text-2xl mb-6">
            WeOuddy is a show, don&apos;t tell professional network
            with beautiful profiles and meaningful connections.
            Designed from the ground up to help you find new
            opportunities or your next great hire.
          </h1>
        </div>
        <VideoShowcase />

        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <TestimonialCard
            quote="WeOuddy is a real gem and is the site of choice for people with high ambitions. Very inspiring people we couldn't have found otherwise."
            author="Dennis Mueller"
            role="Founder at Acme"
          />
          <TestimonialCard
            quote="The quality of the portfolios on WeOuddy are astounding. Not only due to the seamless design of the move, but also because of the caliber of talent on the network."
            author="Giulia Camargo"
            role="Development Lead at Designit"
          />
        </div>

        <FeaturesGrid />
        <div className="text-center py-16">
          <p className="mb-4">
            Unlock profile analytics, custom domains, and more premium
            features by becoming a supporter.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full">
            Become a supporter
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
