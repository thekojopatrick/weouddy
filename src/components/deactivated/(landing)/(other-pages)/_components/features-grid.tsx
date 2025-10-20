import { FeatureCard } from "./feature-card";

export const FeaturesGrid = () => (
  <div className="grid md:grid-cols-2 gap-8 mb-16">
    <FeatureCard
      title="Profiles"
      description="A personal homepage for all your interests and accomplishments."
      image="/images/fun-people-2.png"
    />
    <FeatureCard
      title="Writing"
      description="Publish a blog, journal, or case studies."
      image="/images/fun-people-1.png"
    />
    <FeatureCard
      title="Team Profiles"
      description="Showcase your team culture with Team Profiles."
      image="/images/hero-01.png"
    />
    <FeatureCard
      title="Search"
      description="Generate leads using powerful search filters."
      image="/images/hero-02.png"
    />
    <FeatureCard
      title="Job Listings"
      description="Share your job listings with the best candidates in the world."
      image="/images/hero-02.png"
    />
    <FeatureCard
      title="Posts"
      description="A more casual space for the WeOuddy community to connect."
      image="/images/fun-people-2.png"
    />
  </div>
);
