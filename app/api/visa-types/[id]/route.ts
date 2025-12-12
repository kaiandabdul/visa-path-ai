import { NextResponse } from "next/server";
import { visaTypeQueries } from "@/lib/db/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // UUID format: 8-4-4-4-12 = 36 chars (e.g., "c154ba9b-7afe-47c8-8596-e6e4bfea12f9")
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    // Check if it's a UUID or a code
    const visaType = isUuid
      ? await visaTypeQueries.getById(id)
      : await visaTypeQueries.getByCode(id);

    if (!visaType) {
      return NextResponse.json(
        { success: false, error: "Visa type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: visaType,
    });
  } catch (error) {
    console.error("Error fetching visa type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch visa type" },
      { status: 500 }
    );
  }
}
