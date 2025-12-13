import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analysisSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Schema for updating a session
const UpdateSessionSchema = z.object({
  status: z.enum(["active", "archived", "starred"]).optional(),
  title: z.string().optional(),
});

// GET: Get a specific analysis session
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sessions = await db
      .select()
      .from(analysisSessions)
      .where(eq(analysisSessions.id, id))
      .limit(1);

    if (sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    const session = sessions[0];

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        // Parse the stored pathways data
        pathways: session.pathwaysData || [],
      },
    });
  } catch (error) {
    console.error("Error fetching analysis session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PATCH: Update a session (status, title)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = UpdateSessionSchema.parse(body);

    const [updated] = await db
      .update(analysisSessions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(analysisSessions.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a session
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(analysisSessions).where(eq(analysisSessions.id, id));

    return NextResponse.json({
      success: true,
      message: "Session deleted",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
