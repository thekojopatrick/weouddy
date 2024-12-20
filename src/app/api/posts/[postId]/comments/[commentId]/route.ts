import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string; commentId: string } },
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId, commentId } = await params;

    // Verify the comment exists and belongs to the post
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        post: {
          include: {
            event: {
              include: {
                roles: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.post.id !== postId) {
      return new NextResponse("Comment does not belong to this post", {
        status: 400,
      });
    }

    // Check if user has permission to delete the comment
    // User can delete if they:
    // 1. Are the comment author
    // 2. Are an event admin/moderator
    const isCommentAuthor = comment.userId === session.user.id;
    const isEventAdmin = comment.post.event.roles.some(
      (role) =>
        role.userId === session.user.id &&
        (role.role === "ADMIN" || role.role === "MODERATOR"),
    );

    if (!isCommentAuthor && !isEventAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_COMMENT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
