'use client';

import Image from 'next/image';

export default function SupportUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-lg uppercase tracking-wider font-bold mb-4 text-neutral-900 dark:text-white">
            A journey born from just an idea
          </h1>
          <div className="prose prose-sm max-w-none text-neutral-500 dark:text-neutral-400 space-y-4">
            <p className="text-base text-left">
              Since last year late 2024 getting to Detty December, an
              idea of transforming how people connect, share, and
              remember their most meaningful moments started with one
              person{' '}
              <a
                href="http://x.com/_kojopatrick"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-200"
              >
                (@kojopatrick)
              </a>
              . What started as a casual conversation between three
              friends over BBQ has evolved into a platform designed to
              transform event experiences.
            </p>
            <p className="text-base text-left">
              We realized that traditional event platforms were
              missing the mark, failing to capture the magic of shared
              memories and real-time connections. As developers,
              creatives and event enthusiasts, we set out to create a
              better way to bring people together and preserve those
              moments for a lifetime.
            </p>
            <p className="text-base text-left">
              Today, we&apos;re at a crucial turning point. Our
              platform has grown beyond our initial dreams, looking to
              serve thousands of event creators,regular individuals
              and attendees. But to take this vision to the next level
              - to truly impact how people connect and celebrate - we
              need your support.
            </p>
            <div className="">
              <h2 className=" mb-4 text-lg text-left italic">
                Why We Need Your Support?
              </h2>
              <div className="grid md:grid-cols-1 gap-2">
                <p className="text-left text-base">
                  We&apos;re a small team of 3 passionate individuals
                  working to transform how people experience events.
                </p>
                <p className="text-left text-base">
                  Your support will help us cover operational costs,
                  conduct more user research, enhance our platform’s
                  features, and bring this transformative idea to
                  life. By joining us, you’re not just supporting a
                  platform—you’re helping to shape the future of how
                  we connect, celebrate, and preserve life’s most
                  meaningful moments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Support Us? */}
        <section className="mb-16 max-w-3xl mx-auto">
          {/* Sponsorship Tiers */}
          <div className="grid place-content-center text-center">
            <a href="https://www.buymeacoffee.com/kojopatrick">
              <Image
                alt="buymeacoffee"
                width={200}
                height={100}
                src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=☕&slug=kojopatrick&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff"
              />
            </a>
          </div>
        </section>

        {/* Testimonials */}
        <section className="my-16">
          <h2 className="text-lg uppercase tracking-wider font-bold mb-8 text-center text-neutral-800">
            Our Sponsors
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-xs border text-center max-w-3xl mx-auto">
            <p className="text-base italic mb-4 text-neutral-600">
              &quot;Be the first to support us and leave your
              mark!&quot;
            </p>
            <p className="font-bold text-neutral-700">
              - Future Supporter
            </p>
          </div>
          <div className="grid mt-8">
            <p className="text-neutral-600 text-center">
              Thank you for believing in our vision. Together, we can
              make events unforgettable!
            </p>
            <div className="grid grid-cols-4">
              {/** List of sponsors */}
            </div>
          </div>
        </section>

        {/* Footer */}
      </main>
    </div>
  );
}
