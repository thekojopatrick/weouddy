import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getSession();
    const { postId } = await params;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await req.json();

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        postId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating comment", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const { postId } = await params;

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error fetching comments", { status: 500 });
  }
}
