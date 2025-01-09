import { z } from 'zod';

export const postMediaSchema = z.object({
  url: z.string().url(),
  type: z.enum(['IMAGE', 'VIDEO']),
  order: z.number().int().min(0)
});

export const createPostSchema = z.object({
  eventId: z.string().cuid(),
  caption: z.string().optional(),
  media: z.array(postMediaSchema).max(5)
});

export type CreatePostInput = z.infer<typeof createPostSchema>;