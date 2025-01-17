'use client';

import React, { ReactNode } from 'react';

import { SiteHeader } from '@/components/site-header';

import AuthWrapper from './_components/auth-wrapper';
import { useAccount } from '@/hooks/account/use-account';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { accountData, loading } = useAccount();

  return (
    <AuthWrapper>
      <main>
        {loading ? (
          <div className="h-10 w-full bg-slate-50 shimmer"></div>
        ) : (
          <SiteHeader user={accountData as never} />
        )}
        <>{children}</>
      </main>
    </AuthWrapper>
  );
};

export default AppLayout;
