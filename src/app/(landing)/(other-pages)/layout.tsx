import { SiteHeader } from '@/components/layouts/marketing/site-header';

const LandingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
};

export default LandingLayout;
