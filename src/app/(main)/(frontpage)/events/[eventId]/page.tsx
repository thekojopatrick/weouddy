import type { Metadata, ResolvingMetadata } from 'next';

import EventRoom from '@/features/events/content';
import { formatEventDateTime } from '@/lib/utils/formatters';
import { getSession } from '@/lib/auth';
import { getURL } from '@/lib/utils';
import { EventService } from '@/server/services/event';
import EventAccessGuard from '@/features/events/content/_components/event-access-guard';
import { checkUserEventStatus } from '@/app/actions/check-user-event-status';
import EventNotFound from '@/features/events/content/_components/event-not-found';

type Props = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).eventId;

  // fetch data
  const event = await EventService.getEvent(id);

  // optionally access and extend (rather than replace) parent metadata
  //const previousImages = (await parent).openGraph?.images || [];

  const { date, time } = formatEventDateTime(
    event?.dateTime as never
  );
  const siteUrl = getURL();

  return {
    title: `${event?.name} | WeOuddy - Real-Time Event Engagement and Moments Sharing Platform`,
    description: `Join ${event?.name} on ${date} at ${time}. ${event?.location} : ${event?.description}`,
    openGraph: {
      title: `${event?.name} | WeOuddy - Real-Time Event Engagement`,
      description:
        'Join a vibrant community where real-time engagement brings events to life. Share stories, discover events, and make meaningful connections.',
      url: `${siteUrl}${event?.slug}`,
    },
  };
}

export default async function EventRoomPage(props: {
  params: Promise<{ eventId: string }>;
}) {
  const params = await props.params;
  const { eventId } = await params;

  const session = await getSession();

  if (!session) return null;

  const event = await EventService.getEvent(eventId);

  if (!event.id) return <EventNotFound />;

  const userEventStatus = await checkUserEventStatus({
    eventId: event.id,
    userId: session.userId,
    slug: event.slug,
  });

  return (
    <EventAccessGuard
      user={session?.user}
      event={event || null}
      userStatus={userEventStatus?.status || 'NOT_JOINED'}
    >
      <EventRoom user={session.user} event={event as never} />
    </EventAccessGuard>
  );
}
