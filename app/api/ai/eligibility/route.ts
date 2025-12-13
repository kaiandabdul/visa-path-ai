import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { claudeModel, modelConfig } from "@/lib/ai/clients";
import { ELIGIBILITY_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import {
  visaTypeQueries,
  userQueries,
  profileQueries,
  pathwayQueries,
} from "@/lib/db/queries";

const EligibilityRequestSchema = z.object({
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
  saveToDatabase: z.boolean().optional().default(true),
});

const PathwayResponseSchema = z.object({
  pathways: z
    .array(
      z.object({
        visaTypeCode: z
          .string()
          .describe("The visa type code (e.g., 'de-blue-card', 'nl-hsm')"),
        eligibilityScore: z
          .number()
          .min(0)
          .max(100)
          .describe("Eligibility score from 0-100"),
        successProbability: z
          .number()
          .min(0)
          .max(100)
          .describe("Success probability percentage"),
        estimatedProcessingTime: z
          .number()
          .describe("Estimated processing time in days"),
        totalCostEstimate: z.number().describe("Total estimated cost in USD"),
        reasoning: z.string().describe("Detailed explanation for this pathway"),
        nextSteps: z.array(z.string()).describe("Ordered list of next steps"),
        riskFactors: z.array(z.string()).describe("Potential risk factors"),
      })
    )
    .max(5)
    .describe("Top recommended visa pathways, ranked by fit"),
  overallAssessment: z.string().describe("Overall assessment summary"),
  topRecommendation: z
    .string()
    .describe("The visa code of the top recommended pathway"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request
    const parseResult = EligibilityRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { userProfile, saveToDatabase } = parseResult.data;

    // Fetch visa types from database for target countries
    const visaTypes = await visaTypeQueries.getByCountries(
      userProfile.targetCountries
    );

    if (visaTypes.length === 0) {
      // Fallback to all visa types if no matches
      const allVisas = await visaTypeQueries.getAll();
      visaTypes.push(
        ...allVisas.filter((v) =>
          userProfile.targetCountries.some(
            (tc) => v.country.toLowerCase() === tc.toLowerCase()
          )
        )
      );
    }

    // Format visa types for AI prompt
    const visaTypesForPrompt = visaTypes.map((v) => ({
      code: v.code,
      name: v.name,
      country: v.country,
      category: v.category,
      description: v.description,
      processingTime: `${v.processingTimeMin}-${v.processingTimeMax} days (avg: ${v.processingTimeAvg})`,
      cost: `${v.applicationFee} ${v.currency}${
        v.legalFee ? ` + ${v.legalFee} ${v.currency} legal fees` : ""
      }`,
      successRate: `${v.successRate}%`,
      salaryThreshold: v.salaryThreshold
        ? `${v.salaryThreshold} ${v.currency}`
        : "None",
      educationRequired: v.educationRequired || "None specified",
      languageRequirement: v.languageRequirement || "None",
      requirements: v.requirements,
    }));

    // Get current date for context
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Generate eligibility analysis using Claude
    const result = await generateObject({
      model: claudeModel,
      system: ELIGIBILITY_SYSTEM_PROMPT,
      prompt: `
        CURRENT DATE: ${today}
        
        Analyze the following user profile for visa eligibility and recommend the best pathways.
        Use the current date when considering any time-sensitive requirements or policy changes.

        User Profile:
        - Current Country: ${userProfile.currentCountry}
        - Target Countries: ${userProfile.targetCountries.join(", ")}
        - Profession: ${userProfile.profession}
        - Years of Experience: ${userProfile.yearsExperience}
        - Education Level: ${userProfile.education}
        - Languages Spoken: ${userProfile.languages.join(", ")}
        - Annual Salary: $${userProfile.salary.toLocaleString()} USD

        Available Visa Types (use the exact 'code' field when referencing):
        ${JSON.stringify(visaTypesForPrompt, null, 2)}

        IMPORTANT: 
        - Use the exact 'code' value from the visa types above in visaTypeCode
        - Rank pathways by overall fit for this user's profile
        - Be realistic about eligibility scores based on the user's qualifications
        - Consider processing time, cost, and success rate in your assessment
        - Provide specific, actionable next steps
        - Consider any recent policy changes or updates as of ${today}
      `,
      schema: PathwayResponseSchema,
      temperature: modelConfig.eligibility.temperature,
    });

    const aiPathways = result.object.pathways;

    // Map visa codes to IDs
    const visaCodeToId = new Map(visaTypes.map((v) => [v.code, v.id]));
    const visaCodeToData = new Map(visaTypes.map((v) => [v.code, v]));

    // Prepare response with visa type details
    const pathwaysWithDetails = aiPathways.map((p, index) => {
      const visaData = visaCodeToData.get(p.visaTypeCode);
      return {
        ...p,
        recommendationRank: index + 1,
        visaType: visaData
          ? {
              id: visaData.id,
              code: visaData.code,
              name: visaData.name,
              country: visaData.country,
              category: visaData.category,
              processingTimeAvg: visaData.processingTimeAvg,
              applicationFee: visaData.applicationFee,
              legalFee: visaData.legalFee,
              currency: visaData.currency,
              successRate: visaData.successRate,
            }
          : null,
      };
    });

    // Save to database if requested and email provided
    let savedData = null;
    if (saveToDatabase && userProfile.email) {
      try {
        // Get or create user
        const user = await userQueries.getOrCreate(userProfile.email);

        // Create profile
        const profile = await profileQueries.create({
          userId: user.id,
          currentCountry: userProfile.currentCountry,
          targetCountries: userProfile.targetCountries,
          profession: userProfile.profession,
          yearsExperience: userProfile.yearsExperience,
          education: userProfile.education,
          languages: userProfile.languages,
          salary: userProfile.salary,
        });

        // Create pathways
        const savedPathways = [];
        for (const p of aiPathways) {
          const visaTypeId = visaCodeToId.get(p.visaTypeCode);
          if (visaTypeId) {
            const pathway = await pathwayQueries.create(
              {
                userId: user.id,
                profileId: profile.id,
                eligibilityScore: p.eligibilityScore,
                estimatedProcessingTime: p.estimatedProcessingTime,
                totalCost: p.totalCostEstimate,
                successProbability: p.successProbability,
                recommendationRank: aiPathways.indexOf(p) + 1,
                reasoning: p.reasoning,
                nextSteps: p.nextSteps,
                riskFactors: p.riskFactors,
              },
              [visaTypeId]
            );
            savedPathways.push(pathway);
          }
        }

        savedData = {
          userId: user.id,
          profileId: profile.id,
          pathwayIds: savedPathways.map((p) => p.id),
        };
      } catch (dbError) {
        console.error("Failed to save to database:", dbError);
        // Continue without saving - don't fail the entire request
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        pathways: pathwaysWithDetails,
        overallAssessment: result.object.overallAssessment,
        topRecommendation: result.object.topRecommendation,
        saved: savedData,
      },
      metadata: {
        model: "claude-sonnet-4-20250514",
        visaTypesAnalyzed: visaTypes.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Eligibility analysis error:", error);

    // Handle specific AI SDK errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { success: false, error: "AI service configuration error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to analyze eligibility" },
      { status: 500 }
    );
  }
}
