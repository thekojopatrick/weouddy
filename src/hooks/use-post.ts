import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPostSchema } from '@/types/post';
import { Post } from '@prisma/client';


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

export function usePosts() {
    return useQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      },
      staleTime: 1000 * 60, // Consider data fresh for 1 minute
    });
  }


  export function useToggleLike() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (postId: string) => {
        const res = await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to toggle like');
        return res.json();
      },
      onSuccess: (updatedPost) => {
        queryClient.setQueryData(['posts'], (old: Post[] = []) => {
          return old.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          );
        });
      },
    });
  }