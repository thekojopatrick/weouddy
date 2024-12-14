'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import React from 'react';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
	const router = useRouter();
	return (
		<AuthDialog
			open={true}
			onOpenChangeAction={() => router.back()}
			defaultView={'login'}
		/>
	);
};

export default LoginModal;
