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
    const event = await createEventAction(data, session.userId);

    if (!event) {
      throw new Error("Failed to create event: No event data returned");
    }

    revalidatePath("/discover");
    return event;
  } catch (error) {
    console.error("Error in createEvent:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    throw new Error("Failed to create event due to an unknown error");
  }
}
