import { SITE_URL } from './app';

export const siteConfig = {
  metadataBase: new URL(SITE_URL),
  name: 'WeOuddy',
  description:
    'WeOuddy connects people to moments that matter with real-time event engagement and community sharing.',
  footer: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'FAQ', href: '/faq' },
  ],
};

export const siteMeta = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | WeOuddy',
    default: 'WeOuddy - Real-Time Event Engagement',
  },
  description:
    'Discover, share, and engage with moments that matter. WeOuddy lets you connect in real-time through events, communities, and more.',
  keywords: [
    'real-time engagement',
    'event sharing platform',
    'community sharing',
    'WeOuddy',
    'event management',
    'social events',
    'community connections',
    'event platform',
  ],
  applicationName: 'WeOuddy App',
  openGraph: {
    title: 'WeOuddy - Real-Time Event Engagement Platform',
    description:
      'Join a vibrant community where real-time engagement brings events to life. Share stories, discover events, and make meaningful connections.',
    url: SITE_URL,
    siteName: 'WeOuddy',
    locale: 'en_US',
    type: 'website',
    images: [`${SITE_URL}/opengraph-image.jpg`], // Replace with your hero/banner image path
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeOuddy - Real-Time Event Engagement Platform',
    description:
      'Engage with real-time events and communities on WeOuddy. Share memories, discover events, and connect with others like never before.',
    creator: '@OfficialWeOuddy',
    images: [`${SITE_URL}/twitter-image.jpg`],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
};
