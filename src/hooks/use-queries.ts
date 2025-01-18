import { supabase } from '@/utils/supabase/client';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';

export function useRealTimeUpdates(eventId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`event:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Post',
          filter: `eventId=eq.${eventId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['posts', eventId],
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Like',
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['posts', eventId],
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Comment',
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['posts', eventId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, queryClient]);
}

export function usePosts(eventId: string) {
  return useQuery({
    queryKey: ['posts', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
