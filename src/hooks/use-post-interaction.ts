import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [isPostLiked, setIsPostLiked] = useState(isLiked);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (isCommentsOpen) {
      fetchComments();
    }
  }, [isCommentsOpen, postId]);

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
        const newComment = await response.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  return {
    likes,
    commentCount,
    comments,
    isLiked: isPostLiked,
    isCommentsOpen,
    setIsCommentsOpen,
    handleLike,
    handleComment,
  };
}
