"use server";

import { getSession } from "@/lib/auth";
import { checkAttendeeStatus } from "@/server/services/event/test-join-event";

export async function checkUserEventStatus({
  eventId,
  userId,
  slug,
}: {
  eventId: string;
  userId: string | null;
  slug: string | null;
}) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    console.log("checking start");

    const result = await checkAttendeeStatus(eventId, userId!);

    if (result.status === "DENIED") {
      return {
        success: true,
        status: "DENIED",
        message: "Access Denied, user is not allowed to access this event",
        slug: slug,
      };
    }

    return {
      success: true,
      status: result?.status || "PENDING",
      slug: slug,
    };
  } catch (err) {
    console.error(err);
    return { error: "User event status check failed" };
  }
}
