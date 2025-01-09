import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostSchema } from '@/types/post';


export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, media, eventId }: {
      content?: string;
      media: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; order: number }>;
      eventId: string;
    }) => {
      const validatedData = createPostSchema.parse({
        eventId,
        caption: content,
        media
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return response.json();
    },
    onSuccess: (newPost) => {
        
        queryClient.invalidateQueries({
            queryKey: ['posts', newPost.eventId],
            exact: true
          });
    },
  });
};