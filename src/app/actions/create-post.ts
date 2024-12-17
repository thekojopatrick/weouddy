"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface PostCreateData {
  eventId: string;
  caption?: string;
  media: Array<{
    url: string;
    type: "IMAGE" | "VIDEO";
    order: number;
  }>;
}

export async function createPost(data: PostCreateData) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Create post
    const post = await prisma.post.create({
      data: {
        userId: session.userId,
        eventId: data.eventId,
        caption: data.caption,
        media: {
          create: data.media.map((mediaItem) => ({
            url: mediaItem.url,
            type: mediaItem.type,
            order: mediaItem.order,
          })),
        },
      },
    });

    // Revalidate the event page to show the new post
    revalidatePath(`/events/${data.eventId}`);

    return post;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
}
