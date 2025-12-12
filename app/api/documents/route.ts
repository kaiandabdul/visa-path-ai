import { NextResponse } from "next/server";
import { documentQueries } from "@/lib/db/queries";
import { z } from "zod";

const CreateDocumentSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    "passport",
    "degree",
    "transcript",
    "resume",
    "cover-letter",
    "recommendation",
    "financial",
    "other",
  ]),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileSize: z.number().min(0),
  mimeType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = CreateDocumentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }

    const document = await documentQueries.create(result.data);

    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create document" },
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

    const documents = await documentQueries.getByUserId(userId);

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
