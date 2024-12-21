import EventRoom from '@/components/pages/events/event-room';
import { getEventBySlug } from '@/server/actions/event/queries';
import { getSession } from '@/lib/auth';

export default async function EventRoomPage(props: {
	params: Promise<{ eventId: string }>;
}) {
	const params = await props.params;
	const eventId = await params?.eventId;

	const session = await getSession();

	const event = await getEventBySlug(eventId);

	if (!session) return null;

	return <EventRoom user={session.user} event={event as never} />;
}
