import Footer from '@/components/layouts/marketing/footer';
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
      <Footer />
    </>
  );
};

export default LandingLayout;
