import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { geminiFlashModel } from "@/lib/ai/clients";

// Comprehensive extraction schema that covers all document types
const DocumentExtractionSchema = z.object({
  documentType: z.enum([
    "passport",
    "degree",
    "resume",
    "language",
    "financial",
    "transcript",
    "other",
  ]),
  extractedData: z.object({
    // Common fields
    fullName: z.string().nullable().describe("Full name of the person"),

    // Passport specific
    nationality: z.string().nullable().describe("Nationality/citizenship"),
    passportNumber: z.string().nullable().describe("Passport or ID number"),
    dateOfBirth: z
      .string()
      .nullable()
      .describe("Date of birth in YYYY-MM-DD format"),
    expiryDate: z
      .string()
      .nullable()
      .describe("Expiry date in YYYY-MM-DD format"),
    issueDate: z
      .string()
      .nullable()
      .describe("Issue date in YYYY-MM-DD format"),
    placeOfBirth: z.string().nullable().describe("Place of birth"),
    gender: z.string().nullable().describe("Gender (M/F/X)"),

    // Degree specific
    degreeType: z
      .string()
      .nullable()
      .describe("Type of degree (Bachelor's, Master's, PhD)"),
    fieldOfStudy: z.string().nullable().describe("Field of study or major"),
    institution: z
      .string()
      .nullable()
      .describe("University or institution name"),
    graduationDate: z
      .string()
      .nullable()
      .describe("Graduation date in YYYY-MM-DD format"),

    // Resume specific
    currentTitle: z.string().nullable().describe("Current job title"),
    yearsExperience: z.string().nullable().describe("Years of experience"),
    skills: z.string().nullable().describe("Key skills, comma separated"),

    // Language certificate specific
    testType: z
      .string()
      .nullable()
      .describe("Test type (IELTS, TOEFL, JLPT, etc.)"),
    overallScore: z.string().nullable().describe("Overall score or level"),
    testDate: z.string().nullable().describe("Test date in YYYY-MM-DD format"),

    // Financial specific
    bankName: z.string().nullable().describe("Bank name"),
    accountBalance: z.string().nullable().describe("Account balance amount"),
    currency: z.string().nullable().describe("Currency code (USD, EUR, etc.)"),
  }),
  confidence: z.number().describe("Confidence score 0-100"),
  summary: z.string().describe("Brief summary of what was extracted"),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const suggestedType = (formData.get("type") as string) || "other";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum 10MB allowed." },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // Determine MIME type
    const mimeType = file.type || "application/octet-stream";

    // Check if it's an image or PDF
    const isImage = mimeType.startsWith("image/");
    const isPDF = mimeType === "application/pdf";

    if (!isImage && !isPDF) {
      return NextResponse.json({
        success: true,
        data: {
          documentType: suggestedType,
          extractedData: {},
          confidence: 0,
          summary:
            "This file format cannot be scanned automatically. Please enter details manually.",
          requiresManualEntry: true,
        },
      });
    }

    console.log(`[Document Scan] Analyzing ${file.name} (${mimeType})...`);

    // Build the extraction prompt based on suggested document type
    const typeHints: Record<string, string> = {
      passport:
        "This appears to be a passport. Extract: full name, nationality, passport number, date of birth, expiry date, issue date, place of birth, gender.",
      degree:
        "This appears to be an educational degree or diploma. Extract: holder's name, degree type, field of study, institution name, graduation date.",
      resume:
        "This appears to be a resume/CV. Extract: full name, current job title, years of experience, key skills.",
      language:
        "This appears to be a language test certificate (IELTS, TOEFL, JLPT, etc.). Extract: candidate name, test type, overall score, test date, expiry date if applicable.",
      financial:
        "This appears to be a bank statement or financial document. Extract: account holder name, bank name, currency, account balance if visible.",
      transcript:
        "This appears to be an academic transcript. Extract: student name, institution, field of study, GPA/grades if visible.",
      other:
        "Analyze this document and extract any relevant personal or professional information.",
    };

    const prompt = `You are a document analysis AI. Analyze this uploaded document and extract structured information.

${typeHints[suggestedType] || typeHints.other}

Important:
- Extract dates in YYYY-MM-DD format when possible
- If information is not visible or unclear, set it to null
- Provide a confidence score (0-100) based on how clearly you could read the document
- Be thorough but only extract information that is actually visible

Analyze the document and extract the relevant information.`;

    // Use Gemini Flash with vision to analyze the document
    const result = await generateObject({
      model: geminiFlashModel,
      schema: DocumentExtractionSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image",
              image: `data:${mimeType};base64,${base64Data}`,
            },
          ],
        },
      ],
    });

    console.log(
      `[Document Scan] Extracted: ${result.object.documentType} with ${result.object.confidence}% confidence`
    );

    return NextResponse.json({
      success: true,
      data: {
        documentType: result.object.documentType,
        extractedData: result.object.extractedData,
        confidence: result.object.confidence,
        summary: result.object.summary,
        requiresManualEntry: false,
      },
    });
  } catch (error) {
    console.error("Error scanning document:", error);

    // Return graceful fallback
    return NextResponse.json({
      success: true,
      data: {
        documentType: "other",
        extractedData: {},
        confidence: 0,
        summary:
          "Could not automatically scan this document. Please enter details manually.",
        requiresManualEntry: true,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
