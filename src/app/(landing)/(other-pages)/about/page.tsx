import React from 'react';

import { getURL } from '@/utils';
import { ResolvingMetadata, Metadata } from 'next';
import AboutPage from '../_components/about-page';

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  const siteUrl = getURL();

  return {
    title: `About | WeOuddy - Moments That Matter`,
    description: `WeOuddy is a social platform that reimagines how people
            connect and engage during events and special moments.
            Inspired by the need to share memories effortlessly, our
            platform lets you capture, relive, and preserve those
            experiences while engaging with others in real time. It’s
            where events meet connection, all in one seamless space.`,
    openGraph: {
      title: `About | WeOuddy - Moments That Matter`,
      description:
        'Join a vibrant platform where real-time engagement brings events to life. Share stories, discover events, and make meaningful connections.',
      url: `${siteUrl}/about`,
      images: [
        `${siteUrl}assets/default-event-cover.jpg`,
        ...previousImages,
      ],
    },
  };
}

const Page = () => {
  return <AboutPage />;
};

export default Page;
