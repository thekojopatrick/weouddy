import type { Metadata } from "next";
import EventRoom from "@/features/events/content";
import { getSession } from "@/lib/auth";
import { EventService } from "@/server/services/event";
import EventAccessGuard from "@/features/events/content/_components/event-access-guard";
import { checkUserEventStatus } from "@/components/deactivated/actions/check-user-event-status";
import EventNotFound from "@/features/events/content/_components/event-not-found";
import { generateMetadataForEvent } from "@/lib/utils/generate-metadata";

import AuthGuard from "./auth-guard";

type Props = {
  params: { eventId: string };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { eventId } = await params;
    const event = await EventService.getEventBySlug(eventId);

    if (!event) {
      return {
        title: "Event Not Found",
        description: "The requested event could not be found.",
      };
    }

    return generateMetadataForEvent(event);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Event",
      description: "View event details",
    };
  }
}

export default async function EventRoomPage({ params }: Props) {
  try {
    const { eventId } = await params;
    const session = await getSession();

    // Handle authentication
    if (!session) {
      return <AuthGuard />;
    }

    // Fetch event data
    const event = await EventService.getEvent(eventId);
    if (!event || !event.id) {
      return <EventNotFound />;
    }

    // Check user's event status
    const userEventStatus = await checkUserEventStatus({
      eventId: event.id,
      userId: session.userId,
      slug: event.slug,
    });

    return (
      <EventAccessGuard
        user={session.user}
        event={event}
        userStatus={userEventStatus?.status || "NOT_JOINED"}
      >
        <EventRoom user={session.user} event={event} />
      </EventAccessGuard>
    );
  } catch (error) {
    console.error("Error in EventRoomPage:", error);
    throw error; // Let the nearest error boundary handle it
  }
}
