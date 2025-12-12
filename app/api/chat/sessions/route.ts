import { NextResponse } from "next/server";
import { chatSessionQueries, chatMessageQueries } from "@/lib/db/queries";
import { z } from "zod";

const CreateSessionSchema = z.object({
  userId: z.string().uuid(),
  pathwayId: z.string().uuid().optional(),
  title: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = CreateSessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }

    const session = await chatSessionQueries.create(result.data);

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create chat session" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const sessions = await chatSessionQueries.getByUserId(userId);

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}
