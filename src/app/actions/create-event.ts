"use server";

import { EventFormValues } from "@/types/validation";
import { createEventAction } from "@/server/actions/event/creation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createEvent(data: EventFormValues) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const [hours, minutes] = data.time.split(":");
    const dateTime = new Date(data.date);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const event = await createEventAction(data, session.userId);

    revalidatePath("/events");
    return event;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new Error("Failed to create event");
  }
}
