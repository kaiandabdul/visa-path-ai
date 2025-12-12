import { NextResponse } from "next/server";
import { pathwayQueries } from "@/lib/db/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pathway = await pathwayQueries.getById(id);

    if (!pathway) {
      return NextResponse.json(
        { success: false, error: "Pathway not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pathway,
    });
  } catch (error) {
    console.error("Error fetching pathway:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pathway" },
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
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    const pathway = await pathwayQueries.updateStatus(id, status);

    if (!pathway) {
      return NextResponse.json(
        { success: false, error: "Pathway not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pathway,
    });
  } catch (error) {
    console.error("Error updating pathway:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update pathway" },
      { status: 500 }
    );
  }
}
