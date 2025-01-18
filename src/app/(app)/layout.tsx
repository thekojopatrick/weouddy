import React, { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import AuthWrapper from './_components/auth-wrapper';
import { getSession } from '@/lib/auth';

const AppLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();

  return (
    <AuthWrapper>
      <main>
        <SiteHeader user={session ? session.user : null} />
        <>{children}</>
      </main>
    </AuthWrapper>
  );
};

export default AppLayout;
