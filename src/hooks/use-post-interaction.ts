import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface PostMetrics {
  likes: number;
  commentCount: number;
  isLiked: boolean;
}

export function usePostInteractions(
  postId: string,
  currentUserId: string
) {
  const queryClient = useQueryClient();

  // Fetch post metrics
  const { data: postMetrics } = useQuery<PostMetrics>({
    queryKey: ['postMetrics', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/metrics`);
      if (!response.ok)
        throw new Error('Failed to fetch post metrics');
      return response.json();
    },
    initialData: { likes: 0, commentCount: 0, isLiked: false },
  });

  // Fetch comments
  const { data: comments = [], refetch: refetchComments } = useQuery<
    Comment[]
  >({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
  });

  // Like/Unlike Post
  const likeMutation = useMutation({
    mutationFn: async (isLiked: boolean) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle like');
    },
    onMutate: () => {
      queryClient.setQueryData(
        ['postMetrics', postId],
        (oldMetrics: PostMetrics | undefined) => ({
          ...(oldMetrics as PostMetrics),
          likes:
            (oldMetrics?.likes ?? 0) +
            (postMetrics?.isLiked ? -1 : 1),
          isLiked: !postMetrics?.isLiked,
        })
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['post', postId] }),
    onError: () =>
      queryClient.invalidateQueries({
        queryKey: ['postMetrics', postId],
      }),
  });

  // Add Comment
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
      queryClient.invalidateQueries({
        queryKey: ['postMetrics', postId],
      });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // Delete Comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // UI state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return {
    ...(postMetrics ?? { likes: 0, commentCount: 0, isLiked: false }),
    comments,
    isCommentsOpen,
    setIsCommentsOpen,
    toggleLike: () => likeMutation.mutate(!likeMutation.isPending),
    addComment: async (content: string) =>
      await addCommentMutation.mutateAsync(content),
    deleteComment: async (commentId: string) =>
      await deleteCommentMutation.mutateAsync(commentId),
    refetchComments,
    currentUserId,
  };
}
