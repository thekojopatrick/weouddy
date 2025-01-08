// app/api/feedback/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma} from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const feedbackSchema = z.object({
  rating: z.number().min(0).max(8),
  message: z.string().optional(),
  type: z.enum(["ACCOUNT_SETUP", "EVENT_EXPERIENCE", "APP_USABILITY", "BUG_REPORT", "FEATURE_REQUEST", "OTHER"]),
  category: z.enum(["UI_UX", "PERFORMANCE", "FUNCTIONALITY", "CONTENT", "TECHNICAL", "GENERAL"]),
  metadata: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = feedbackSchema.parse(body);

    const feedback = await prisma.feedback.createMany({
      data: {
        userId: session.user.id,
        rating: validatedData.rating,
        message: validatedData.message,
        type: validatedData.type,
        category: validatedData.category,
        metadata: validatedData.metadata || {},
      },
    });

    return NextResponse.json({ success: true, feedback });
    
  } catch (error) {
    console.error("Error submitting feedback:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid feedback data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch feedback (for admins)
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Add role check here if needed
    const feedbackItems = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ feedbackItems });
    
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}