import React, { ReactNode } from 'react';

import { SiteHeader } from '@/components/site-header';
import { getSession } from '@/lib/auth';

const AppLayout = async ({ children }: { children: ReactNode }) => {
	const session = await getSession();

	if (!session) {
		return null;
	}

	return (
		<main>
			<SiteHeader user={session?.user ?? null} />
			<section>{children}</section>
		</main>
	);
};

export default AppLayout;
