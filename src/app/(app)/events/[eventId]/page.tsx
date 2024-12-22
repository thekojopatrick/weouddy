import EventRoom from '@/components/pages/events/event-room';
import { getEventBySlug } from '@/server/actions/event/queries';
import { getSession } from '@/lib/auth';

export default async function EventRoomPage(props: {
	params: Promise<{ eventId: string }>;
}) {
	const params = await props.params;
	const { eventId } = await params;

	const session = await getSession();

	if (!session) return null;

	const event = await getEventBySlug(eventId);

	return <EventRoom user={session.user} event={event as never} />;
}
