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

    // Add some debug logging
    console.log("Creating event with data:", data);
    console.log("User ID:", session.userId);

    const event = await createEventAction(data, session.userId);

    // Add logging for the created event
    console.log("Event created:", event);

    revalidatePath("/");
    return event;
  } catch (error) {
    // More detailed error logging
    console.error("Detailed error in createEvent:", error);

    // If it's an error with a message, throw that specific message
    if (error instanceof Error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    // Fallback error if something else goes wrong
    throw new Error("Failed to create event due to an unknown error");
  }
}
