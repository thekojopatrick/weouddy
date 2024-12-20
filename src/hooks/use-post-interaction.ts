import { useState } from "react";

interface UsePostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  isLiked?: boolean;
}

export function usePostInteractions({
  postId,
  initialLikes,
  initialComments,
  isLiked = false,
}: UsePostInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [isPostLiked, setIsPostLiked] = useState(isLiked);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isPostLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsPostLiked(!isPostLiked);
        setLikes((prev) => isPostLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = async (content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setComments((prev) => prev + 1);
        // You might want to refetch comments here
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return {
    likes,
    comments,
    isLiked: isPostLiked,
    isCommentsOpen,
    setIsCommentsOpen,
    handleLike,
    handleComment,
  };
}
