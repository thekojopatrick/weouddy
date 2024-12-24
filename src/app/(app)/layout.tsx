import React, { ReactNode } from 'react';

import { SiteHeader } from '@/components/site-header';
import { getAllEvents } from '@/server/actions/event/queries';
import { getSession } from '@/lib/auth';

const AppLayout = async ({ children }: { children: ReactNode }) => {
	const session = await getSession();

	const events = await getAllEvents(session?.user?.id);
	return (
		<div>
			<SiteHeader user={session?.user ?? null} events={events as never} />
			<main>{children}</main>
		</div>
	);
};

export default AppLayout;
