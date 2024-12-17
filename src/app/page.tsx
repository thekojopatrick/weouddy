import HomePage from '@/components/pages/homepage';
import { createClient } from '@/lib/supabase/server';
import { getAllEvents } from '@/server/actions/event/queries';

export default async function page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const events = await getAllEvents(user?.id);

	console.log({ events });

	return <HomePage user={user} events={events as []} />;
}
