'use client';

import React, { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import AuthWrapper from './_components/auth-wrapper';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthWrapper>
      <main>
        <SiteHeader />

        <>{children}</>
      </main>
    </AuthWrapper>
  );
};

export default AppLayout;
