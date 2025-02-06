import { db } from "@/server/db/prisma";
import { CreatePostInput } from "@/types/post";
import { revalidatePath } from "next/cache";

export class PostService {
  static async createPost(userId: string, data: CreatePostInput) {
    // Check if user has access to event
    const hasAccess = await this.validateEventAccess(userId, data.eventId);
    if (!hasAccess.status) {
      throw new Error(
        "Unauthorized access to event: User is not the host or a member",
      );
    }

    try {
      const post = await db.post.create({
        data: {
          userId,
          eventId: hasAccess.eventId,
          caption: data.caption,
          media: {
            create: data.media.map((mediaItem) => ({
              url: mediaItem.url,
              type: mediaItem.type,
              order: mediaItem.order,
            })),
          },
        },
        include: {
          user: {
            select: {
              name: true,
              avatarUrl: true,
              username: true,
            },
          },
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      revalidatePath(`/events/${data.eventId}`);
      return post;
    } catch (error) {
      console.error("Post creation failed:", error);
      throw new Error("Failed to create post");
    }
  }

  static async toggleLike(postId: string, userId: string) {
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await db.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await db.like.create({
        data: {
          postId,
          userId,
        },
      });
    }

    return this.getPost(postId);
  }

  static async getPost(postId: string) {
    return db.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            username: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  static async getAllPosts(eventId: string) {
    return db.post.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            username: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private static async validateEventAccess(userId: string, eventId: string) {
    const event = await db.event.findUnique({
      where: { publicId: eventId },
      include: {
        host: true,
        attendees: true,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // If the event is public, allow access
    // if (!event.isPrivate) {
    //   return true;
    // }

    // If the event is private, check if the user is the host or a member
    const isHost = event.hostId === userId;
    const isMember = event.attendees.some((member) => member.userId === userId);

    return { eventId: event.id, status: isHost || isMember };
  }
}
