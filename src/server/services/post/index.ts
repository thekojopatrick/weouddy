import { db } from '@/server/db/prisma';
import { CreatePostInput } from '@/types/post';
import { revalidatePath } from 'next/cache';

export class PostService {
  static async createPost(userId: string, data: CreatePostInput) {
    // Check if user has access to event
    const hasAccess = await this.validateEventAccess(userId, data.eventId);
    if (!hasAccess) {
      throw new Error('Unauthorized access to event');
    }

    try {
      const post = await db.post.create({
        data: {
          userId,
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
      console.error('Post creation failed:', error);
      throw new Error('Failed to create post');
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

  private static async validateEventAccess(userId: string, eventId: string) {
    const event = await db.event.findFirst({
      where: {
        id: eventId,
        OR: [
          { hostId: userId },
          { members: { some: { id: userId } } }
        ]
      }
    });
    return !!event;
  }
}