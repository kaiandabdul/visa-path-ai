import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analysisSessions, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

// Schema for creating a new analysis session
const CreateSessionSchema = z.object({
  userProfile: z.object({
    email: z.string().email().optional(),
    currentCountry: z.string(),
    targetCountries: z.array(z.string()),
    profession: z.string(),
    yearsExperience: z.number(),
    education: z.string(),
    languages: z.array(z.string()),
    salary: z.number(),
  }),
});

// GET: List analysis sessions for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status"); // active, archived, starred, all
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build query
    let query = db.select().from(analysisSessions);

    if (userId) {
      query = query.where(eq(analysisSessions.userId, userId)) as typeof query;
    }

    if (status && status !== "all") {
      query = query.where(eq(analysisSessions.status, status)) as typeof query;
    }

    const sessions = await query
      .orderBy(desc(analysisSessions.createdAt))
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error("Error fetching analysis sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analysis sessions" },
      { status: 500 }
    );
  }
}

// POST: Create a new analysis session (triggers AI eligibility analysis)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userProfile } = CreateSessionSchema.parse(body);

    // Get or create user
    let userId: string | null = null;
    if (userProfile.email) {
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, userProfile.email))
        .limit(1);

      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
      } else {
        const [newUser] = await db
          .insert(users)
          .values({ email: userProfile.email })
          .returning();
        userId = newUser.id;
      }
    }

    // Call the eligibility API internally
    const eligibilityResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/ai/eligibility`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          saveToDatabase: false, // We'll save the session ourselves
        }),
      }
    );

    if (!eligibilityResponse.ok) {
      throw new Error("Eligibility analysis failed");
    }

    const eligibilityResult = await eligibilityResponse.json();

    if (!eligibilityResult.success) {
      throw new Error(eligibilityResult.error || "Analysis failed");
    }

    const { pathways, overallAssessment, topRecommendation } =
      eligibilityResult.data;

    // Find top pathway
    const topPathway = pathways.reduce(
      (
        best: { visaTypeCode: string; eligibilityScore: number } | null,
        current: { visaTypeCode: string; eligibilityScore: number }
      ) =>
        !best || current.eligibilityScore > best.eligibilityScore
          ? current
          : best,
      null
    );

    // Create analysis session
    const [session] = await db
      .insert(analysisSessions)
      .values({
        userId,
        profileSnapshot: userProfile,
        targetCountries: userProfile.targetCountries,
        status: "active",
        pathwaysCount: pathways.length,
        topPathwayCode: topPathway?.visaTypeCode || null,
        topPathwayScore: topPathway?.eligibilityScore || null,
        overallAssessment,
        topRecommendation,
        pathwaysData: pathways,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        summary: {
          pathwaysCount: pathways.length,
          topPathway: topPathway?.visaTypeCode,
          topScore: topPathway?.eligibilityScore,
        },
      },
    });
  } catch (error) {
    console.error("Error creating analysis session:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create analysis session" },
      { status: 500 }
    );
  }
}
