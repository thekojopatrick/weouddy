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
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const { data: postMetrics } = useQuery<PostMetrics>({
    queryKey: ['postMetrics', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/metrics`);
      if (!response.ok)
        throw new Error('Failed to fetch post metrics');
      return response.json();
    },
    //staleTime: 30 * 1000, // Keep data fresh for 30 seconds
  });

  const { data: comments = [], refetch: refetchComments } = useQuery<
    Comment[]
  >({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
    enabled: isCommentsOpen, // Only fetch when comments are visible
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: postMetrics?.isLiked ? 'DELETE' : 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['postMetrics', postId],
      });
      const previousMetrics = queryClient.getQueryData([
        'postMetrics',
        postId,
      ]);

      queryClient.setQueryData(
        ['postMetrics', postId],
        (old: PostMetrics | undefined) => ({
          ...old,
          likes: (old?.likes ?? 0) + (postMetrics?.isLiked ? -1 : 1),
          isLiked: !postMetrics?.isLiked,
        })
      );

      return { previousMetrics };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ['postMetrics', postId],
        context?.previousMetrics
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['postMetrics', postId],
      });
    },
  });

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
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({
        queryKey: ['comments', postId],
      });
      const previousComments = queryClient.getQueryData([
        'comments',
        postId,
      ]);

      // Optimistically add the new comment
      const optimisticComment: Comment = {
        id: 'temp-' + Date.now(),
        content: newContent,
        createdAt: new Date().toISOString(),
        userId: currentUserId,
        user: {
          id: currentUserId,
          name: 'You', // This will be replaced when the real data comes in
          avatarUrl: null,
        },
      };

      queryClient.setQueryData(
        ['comments', postId],
        (old: Comment[] = []) => [optimisticComment, ...old]
      );

      // Update metrics
      queryClient.setQueryData(
        ['postMetrics', postId],
        (old: PostMetrics | undefined) => ({
          ...old,
          commentCount: (old?.commentCount ?? 0) + 1,
        })
      );

      return { previousComments };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ['comments', postId],
        context?.previousComments
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
      queryClient.invalidateQueries({
        queryKey: ['postMetrics', postId],
      });
    },
  });

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
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ['comments', postId],
      });
      const previousComments = queryClient.getQueryData([
        'comments',
        postId,
      ]);

      // Optimistically remove the comment
      queryClient.setQueryData(
        ['comments', postId],
        (old: Comment[] = []) =>
          old.filter((comment) => comment.id !== commentId)
      );

      // Update metrics
      queryClient.setQueryData(
        ['postMetrics', postId],
        (old: PostMetrics | undefined) => ({
          ...old,
          commentCount: Math.max(0, (old?.commentCount ?? 0) - 1),
        })
      );

      return { previousComments };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ['comments', postId],
        context?.previousComments
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
      queryClient.invalidateQueries({
        queryKey: ['postMetrics', postId],
      });
    },
  });

  return {
    likes: postMetrics?.likes ?? 0,
    commentCount: postMetrics?.commentCount ?? 0,
    isLiked: postMetrics?.isLiked ?? false,
    comments,
    isCommentsOpen,
    setIsCommentsOpen,
    toggleLike: () => likeMutation.mutateAsync(),
    addComment: (content: string) =>
      addCommentMutation.mutateAsync(content),
    deleteComment: (commentId: string) =>
      deleteCommentMutation.mutateAsync(commentId),
    refetchComments,
    currentUserId,
  };
}
