import { NextResponse } from "next/server";
import { chatSessionQueries, chatMessageQueries } from "@/lib/db/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await chatSessionQueries.getById(id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Chat session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching chat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chat session" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const session = await chatSessionQueries.updateTitle(id, title);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Chat session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error updating chat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update chat session" },
      { status: 500 }
    );
  }
}
