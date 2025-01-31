import { createPostSchema } from "@/types/post";
import { PostService } from "@/server/services/post";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createPostSchema.parse(body);

    const post = await PostService.createPost(session.userId, validatedData);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post. Please try again." },
      { status: 500 },
    );
  }
}
