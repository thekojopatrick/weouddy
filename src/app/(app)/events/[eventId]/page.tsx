import EventRoom from '@/components/pages/events/event-room';
import { createClient } from '@/lib/supabase/server';
import { getEventBySlug } from '@/server/actions/event/queries';

export default async function EventRoomPage(props: {
	params: Promise<{ eventId: string }>;
}) {
	const params = await props.params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const eventId = await params?.eventId;

	const event = await getEventBySlug(eventId);

	console.log({ event, eventId });

	return <EventRoom user={user} event={event as never} />;
}
