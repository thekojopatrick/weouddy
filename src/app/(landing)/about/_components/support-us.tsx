'use client';
import { PricingPage } from './pricing-page';
import Footer from '@/components/marketing/footer';

export default function SupportUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-lg uppercase tracking-wider font-bold mb-4 text-neutral-900 dark:text-white">
            A Journey Born from Passion
          </h1>
          <div className="prose prose-sm max-w-none text-neutral-500 dark:text-neutral-400 space-y-4">
            <p className="text-base text-left">
              Since early 2023, we&apos;ve been on an incredible
              journey to transform how people experience and remember
              their most precious moments. What started as a simple
              idea between three friends over coffee has grown into
              something much bigger than ourselves.
            </p>
            <p className="text-base text-left">
              We saw firsthand how traditional event platforms were
              failing to capture the true essence of memorable
              experiences. As developers and event enthusiasts
              ourselves, we knew there had to be a better way to bring
              people together and create lasting memories.
            </p>
            <p className="text-base text-left">
              Today, we&apos;re at a crucial turning point. Our
              platform has grown beyond our initial dreams, serving
              thousands of event creators and attendees. But to take
              this vision to the next level - to truly revolutionize
              how people connect and celebrate - we need your support.
            </p>
            <p className="text-base font-medium text-left">
              We&apos;re not just building a platform; we&apos;re
              crafting the future of shared experiences. And we want
              you to be part of this journey.
            </p>
          </div>
        </section>

        {/* Why Support Us? */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-lg uppercase tracking-wider font-bold mb-4 text-center text-gray-800">
            Why Your Support Matters
          </h2>
          <div className="grid md:grid-cols-1 gap-3">
            <p className="text-gray-600 text-base">
              We&apos;re a small team of 3 passionate individuals
              working to revolutionize how people experience events.
            </p>

            <p className="text-gray-600 text-base">
              Your contribution helps us cover operational costs,
              develop new features, and bring our vision to life.
            </p>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <PricingPage />

        {/* Testimonials */}
        <section className="my-16">
          <h2 className="text-lg uppercase tracking-wider font-bold mb-8 text-center text-neutral-800">
            Our Sponsors
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center max-w-3xl mx-auto">
            <p className="text-base italic mb-4 text-neutral-600">
              &quot;Be the first to support us and leave your
              mark!&quot;
            </p>
            <p className="font-bold text-neutral-700">
              - Future Supporter
            </p>
          </div>
          <div className="grid mt-8">
            <p className="text-neutral-600">
              Thank you for believing in our vision. Together, we can
              make events unforgettable!
            </p>
            <div className="grid grid-cols-4"></div>
          </div>
        </section>

        {/* Footer */}
      </main>
      <Footer />
    </div>
  );
}
