import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visaResearch, visaTypes } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { geminiModel } from "@/lib/ai/clients";

// Schema for the AI-generated visa research
const VisaResearchSchema = z.object({
  officialRequirements: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: z.enum(["critical", "important", "helpful"]),
      documentNeeded: z.boolean(),
    })
  ),
  currentFees: z.object({
    applicationFee: z.number(),
    currency: z.string(),
    additionalFees: z.array(
      z.object({
        name: z.string(),
        amount: z.number(),
        optional: z.boolean(),
      })
    ),
    totalEstimate: z.number(),
    lastUpdated: z.string(),
  }),
  processingTimes: z.object({
    standard: z.object({
      minDays: z.number(),
      maxDays: z.number(),
      avgDays: z.number(),
    }),
    expedited: z
      .object({
        available: z.boolean(),
        days: z.number().optional(),
        additionalCost: z.number().optional(),
      })
      .optional(),
  }),
  eligibilityCriteria: z.object({
    minimumSalary: z.number().nullable(),
    salaryCurrency: z.string().nullable(),
    educationRequired: z.string().nullable(),
    experienceYears: z.number().nullable(),
    languageRequirement: z.string().nullable(),
    ageLimit: z.number().nullable(),
    additionalCriteria: z.array(z.string()),
  }),
  applicationSteps: z.array(
    z.object({
      step: z.number(),
      title: z.string(),
      description: z.string(),
      estimatedDays: z.number(),
      onlineAvailable: z.boolean(),
    })
  ),
  recentChanges: z.array(z.string()),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(["government", "official", "immigration_portal", "other"]),
    })
  ),
  aiSummary: z.string(),
  confidenceScore: z.number().min(0).max(100),
});

// Cache duration: 7 days
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Country code to name mapping
const COUNTRY_NAMES: Record<string, string> = {
  DE: "Germany",
  NL: "Netherlands",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  SG: "Singapore",
  AE: "UAE",
  PT: "Portugal",
  ES: "Spain",
  FR: "France",
  US: "United States",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const visaCode = code.toUpperCase();

    // Find the visa type in DB
    const visaTypeResults = await db
      .select()
      .from(visaTypes)
      .where(eq(visaTypes.code, visaCode))
      .limit(1);

    if (visaTypeResults.length === 0) {
      return NextResponse.json(
        { success: false, error: "Visa type not found" },
        { status: 404 }
      );
    }

    const visaType = visaTypeResults[0];

    // Check for cached research (not expired)
    const now = new Date();
    const cachedResearch = await db
      .select()
      .from(visaResearch)
      .where(
        and(
          eq(visaResearch.visaCode, visaCode),
          gt(visaResearch.expiresAt, now)
        )
      )
      .limit(1);

    if (cachedResearch.length > 0) {
      // Return cached data
      const cached = cachedResearch[0];
      return NextResponse.json({
        success: true,
        data: {
          visa: visaType,
          research: {
            ...cached,
            isLive: false,
            fromCache: true,
          },
        },
      });
    }

    // No valid cache - perform live research with Gemini
    console.log(`[Visa Research] Performing live research for ${visaCode}...`);

    const countryName = COUNTRY_NAMES[visaType.country] || visaType.country;

    const result = await generateObject({
      model: geminiModel,
      schema: VisaResearchSchema,
      prompt: `You are a professional immigration consultant researching the "${
        visaType.name
      }" visa for ${countryName}.

Research and provide CURRENT, VERIFIED information about this visa:

Visa Code: ${visaCode}
Visa Name: ${visaType.name}
Category: ${visaType.category}
Description: ${visaType.description || "Work/immigration visa"}

Please research:
1. Official requirements - what documents and qualifications are needed
2. Current application fees (in local currency) as of 2024/2025
3. Processing times - standard and expedited if available
4. Eligibility criteria - salary, education, experience, language requirements
5. Step-by-step application process
6. Any recent policy changes in the last 6 months
7. Official government sources (provide real URLs)

IMPORTANT:
- Only provide verified information from official sources
- Include real government website URLs in sources
- Be accurate about fees and timelines
- If uncertain about any data, mark confidence score lower
- Current date is ${new Date().toISOString().split("T")[0]}`,
    });

    // Save research to cache
    const expiresAt = new Date(Date.now() + CACHE_DURATION_MS);

    // Delete old cache entries for this visa
    await db.delete(visaResearch).where(eq(visaResearch.visaCode, visaCode));

    // Insert new research
    const [savedResearch] = await db
      .insert(visaResearch)
      .values({
        visaTypeId: visaType.id,
        visaCode: visaCode,
        researchedAt: now,
        expiresAt,
        officialRequirements: result.object.officialRequirements,
        currentFees: result.object.currentFees,
        processingTimes: result.object.processingTimes,
        eligibilityCriteria: result.object.eligibilityCriteria,
        applicationSteps: result.object.applicationSteps,
        recentChanges: result.object.recentChanges,
        sources: result.object.sources,
        aiSummary: result.object.aiSummary,
        confidenceScore: result.object.confidenceScore,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        visa: visaType,
        research: {
          ...savedResearch,
          isLive: true,
          fromCache: false,
        },
      },
    });
  } catch (error) {
    console.error("Error researching visa:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to research visa details",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST: Force refresh research (bypass cache)
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const visaCode = code.toUpperCase();

    // Delete existing cache
    await db.delete(visaResearch).where(eq(visaResearch.visaCode, visaCode));

    // Redirect to GET to perform fresh research
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/ai/research/${visaCode}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error refreshing visa research:", error);
    return NextResponse.json(
      { success: false, error: "Failed to refresh research" },
      { status: 500 }
    );
  }
}
