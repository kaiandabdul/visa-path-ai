import { NextResponse } from "next/server";
import {
  pathwayQueries,
  visaTypeQueries,
  profileQueries,
} from "@/lib/db/queries";
import { z } from "zod";

const CreatePathwaySchema = z.object({
  userId: z.string().uuid(),
  profileId: z.string().uuid(),
  visaTypeIds: z.array(z.string().uuid()).min(1),
  eligibilityScore: z.number().min(0).max(100),
  estimatedProcessingTime: z.number().min(0),
  totalCost: z.number().min(0),
  successProbability: z.number().min(0).max(100),
  recommendationRank: z.number().min(1),
  reasoning: z.string(),
  nextSteps: z.array(z.string()),
  riskFactors: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = CreatePathwaySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { visaTypeIds, ...pathwayData } = result.data;

    const pathway = await pathwayQueries.create(pathwayData, visaTypeIds);

    return NextResponse.json({
      success: true,
      data: pathway,
    });
  } catch (error) {
    console.error("Error creating pathway:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create pathway" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const profileId = searchParams.get("profileId");

    let pathways;

    if (profileId) {
      pathways = await pathwayQueries.getByProfileId(profileId);
    } else if (userId) {
      pathways = await pathwayQueries.getByUserId(userId);
    } else {
      return NextResponse.json(
        { success: false, error: "userId or profileId is required" },
        { status: 400 }
      );
    }

    // Transform to include visa type details
    const transformedPathways = pathways.map((p) => ({
      ...p,
      visaTypes: p.visaTypes.map((pvt) => pvt.visaType),
    }));

    return NextResponse.json({
      success: true,
      data: transformedPathways,
    });
  } catch (error) {
    console.error("Error fetching pathways:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pathways" },
      { status: 500 }
    );
  }
}
