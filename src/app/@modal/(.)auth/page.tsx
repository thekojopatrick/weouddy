'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const LoginModal = () => {
  const router = useRouter();
  const pathName = usePathname();
  console.log(pathName);

  return (
    <AuthDialog
      open={pathName == '/forgot-passwod' ? false : true}
      onOpenChangeAction={() => router.back()}
      defaultView={'login'}
    />
  );
};

export default LoginModal;
