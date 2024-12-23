import DiscoverPage from '@/components/pages/discover';
import { getAllEvents } from '@/server/actions/event/queries';
import { getSession } from '@/lib/auth';

export default async function Page() {
	const session = await getSession();

	const events = await getAllEvents(session?.user?.id);

	// console.log({ events });

	return <DiscoverPage events={events as []} />;
}
