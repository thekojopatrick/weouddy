import EventRoom from '@/components/pages/events/event-room';
import { createClient } from '@/lib/supabase/server';
import { getEventBySlug } from '@/server/actions/event/queries';

export default async function EventRoomPage({
	params,
}: {
	params: { eventId: string };
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const event = await getEventBySlug(params.eventId);

	console.log({ event });

	return <EventRoom user={user} event={event as never} />;
}
