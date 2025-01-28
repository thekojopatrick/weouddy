import { PricingCards } from '../_components/pricing-card';

const tiers = [
  {
    name: 'SUPPORTER',
    price: 10,
    interval: 'monthly',
    description: 'Per month (+ local tax)',
    features: [
      { name: 'Name listed on our website', included: true },
      { name: 'Shoutout on social media', included: true },
      { name: '24/7 email support', included: true },
    ],
    cta: {
      text: 'Start sponsorship',
      href: '/signup',
    },
  },
  {
    name: 'PARTNER',
    price: 50,
    interval: 'monthly',
    description: 'Per month (+ local tax)',
    features: [
      { name: 'Profile insights and analytics.', included: true },
      { name: 'Shoutout on social media', included: true },
      { name: 'Logo placement on our website', included: true },
      {
        name: 'Personalized thank-you video',
        included: true,
        highlight: true,
      },
    ],
    cta: {
      text: 'Start sponsorship',
      href: '/signup',
    },
  },
  {
    name: 'CHAIRMAN',
    price: 100,
    interval: 'monthly',
    description: 'Per month (+ local tax)',
    highlight: true,
    features: [
      { name: 'Profile insights and analytics.', included: true },
      {
        name: 'Exclusive early access to new features',
        included: true,
      },
      { name: 'Advanced analytics', included: true },
      { name: '24/7 priority support', included: true },
      {
        name: 'Supporter badge on WeOuddy and Posts.',
        included: true,
        highlight: true,
      },
    ],
    cta: {
      text: 'Start sponsorship',
      onClick: () => console.log('Contact sales clicked'),
    },
  },
];

function PricingPage() {
  return (
    <PricingCards
      tiers={tiers}
      className="gap-6"
      sectionClassName="bg-transparent px-0 py-0 sm:py-0 md:py-0"
      containerClassName="py-0 px-0 "
    />
  );
}

export { PricingPage };
