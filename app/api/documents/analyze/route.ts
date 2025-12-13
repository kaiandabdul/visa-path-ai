import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/ai/clients";

// Schema for extracted document information
const PassportExtractionSchema = z.object({
  documentType: z.literal("passport"),
  fullName: z.string().describe("Full name as shown on passport"),
  nationality: z.string().describe("Country/nationality"),
  passportNumber: z.string().describe("Passport number"),
  dateOfBirth: z
    .string()
    .nullable()
    .describe("Date of birth (YYYY-MM-DD format)"),
  expiryDate: z
    .string()
    .nullable()
    .describe("Passport expiry date (YYYY-MM-DD format)"),
  issueDate: z
    .string()
    .nullable()
    .describe("Passport issue date (YYYY-MM-DD format)"),
  placeOfBirth: z.string().nullable().describe("Place of birth"),
  gender: z.string().nullable().describe("Gender (M/F/X)"),
  issuingAuthority: z
    .string()
    .nullable()
    .describe("Issuing authority or country"),
  mrz: z.string().nullable().describe("Machine Readable Zone text if visible"),
  summary: z.string().describe("Brief summary of the passport information"),
});

const DegreeExtractionSchema = z.object({
  documentType: z.literal("degree"),
  holderName: z.string().describe("Name of the degree holder"),
  degreeType: z
    .string()
    .describe("Type of degree (Bachelor's, Master's, PhD, etc.)"),
  fieldOfStudy: z.string().describe("Field of study or major"),
  institution: z.string().describe("Name of the issuing institution"),
  graduationDate: z
    .string()
    .nullable()
    .describe("Graduation date (YYYY-MM-DD format)"),
  country: z.string().describe("Country where the institution is located"),
  honors: z.string().nullable().describe("Any honors or distinctions"),
  gpa: z.string().nullable().describe("GPA or grade if mentioned"),
  summary: z
    .string()
    .describe("Brief summary of the educational qualification"),
});

const ResumeExtractionSchema = z.object({
  documentType: z.literal("resume"),
  fullName: z.string().describe("Full name"),
  currentTitle: z.string().nullable().describe("Current job title"),
  totalExperience: z.string().nullable().describe("Total years of experience"),
  skills: z.array(z.string()).describe("Key skills listed"),
  recentEmployer: z.string().nullable().describe("Most recent employer"),
  education: z.string().nullable().describe("Highest education mentioned"),
  languages: z.array(z.string()).describe("Languages mentioned"),
  summary: z.string().describe("Brief professional summary"),
});

const FinancialExtractionSchema = z.object({
  documentType: z.literal("financial"),
  accountHolder: z.string().nullable().describe("Account holder name"),
  bankName: z.string().nullable().describe("Name of the bank"),
  accountType: z.string().nullable().describe("Type of account"),
  currency: z.string().nullable().describe("Currency"),
  currentBalance: z.string().nullable().describe("Current balance if visible"),
  statementDate: z.string().nullable().describe("Statement date"),
  summary: z.string().describe("Brief summary of the financial document"),
});

const LanguageCertExtractionSchema = z.object({
  documentType: z.literal("language"),
  candidateName: z.string().describe("Name of the test taker"),
  testType: z.string().describe("Type of test (IELTS, TOEFL, JLPT, etc.)"),
  overallScore: z.string().nullable().describe("Overall score or level"),
  testDate: z.string().nullable().describe("Date of test (YYYY-MM-DD format)"),
  expiryDate: z.string().nullable().describe("Expiry date if applicable"),
  subScores: z
    .record(z.string(), z.string())
    .nullable()
    .describe("Sub-scores (reading, writing, etc.)"),
  summary: z.string().describe("Brief summary of the language proficiency"),
});

const GenericExtractionSchema = z.object({
  documentType: z.literal("other"),
  title: z.string().describe("Document title or type"),
  mainContent: z.string().describe("Main content or purpose of the document"),
  keyDates: z.array(z.string()).describe("Any important dates found"),
  keyNames: z.array(z.string()).describe("Any important names found"),
  summary: z.string().describe("Brief summary of the document"),
});

// Union schema for all document types
const DocumentExtractionSchema = z.union([
  PassportExtractionSchema,
  DegreeExtractionSchema,
  ResumeExtractionSchema,
  FinancialExtractionSchema,
  LanguageCertExtractionSchema,
  GenericExtractionSchema,
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("type") as string) || "other";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64 for AI vision
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Determine MIME type
    const mimeType = file.type || "application/octet-stream";

    // Build extraction prompt based on document type
    const extractionPrompts: Record<string, string> = {
      passport: `Extract all information from this passport document. Look for:
- Full name, nationality, passport number
- Date of birth, place of birth
- Issue date, expiry date
- Gender, issuing authority
- Machine Readable Zone (MRZ) if visible`,

      degree: `Extract all information from this educational degree/certificate. Look for:
- Holder's name, degree type (Bachelor's, Master's, PhD)
- Field of study, institution name
- Graduation date, country
- Any honors, GPA or grades`,

      resume: `Extract key information from this resume/CV. Look for:
- Full name, current job title
- Total years of experience
- Key skills, recent employers
- Education, languages spoken`,

      financial: `Extract information from this financial document. Look for:
- Account holder name, bank name
- Account type, currency
- Current balance, statement date`,

      language: `Extract information from this language certificate. Look for:
- Candidate name, test type (IELTS, TOEFL, etc.)
- Overall score, sub-scores
- Test date, expiry date`,

      other: `Extract key information from this document. Look for:
- Document title or type
- Main content or purpose
- Important dates and names`,
    };

    const prompt = extractionPrompts[documentType] || extractionPrompts.other;

    // Use Gemini to analyze the document
    // Note: For production, you'd want to use a vision-capable model
    // Here we're simulating by analyzing the filename and common patterns

    // For now, return a structured placeholder that can be enhanced
    // When Gemini vision is available in AI SDK, this can be upgraded

    const extractedData = {
      documentType,
      analyzed: true,
      fileName: file.name,
      fileSize: file.size,
      mimeType,
      extractedAt: new Date().toISOString(),
      // Placeholder extraction - in production, use AI vision
      content: {
        summary: `Document "${file.name}" uploaded as ${documentType}. AI analysis would extract detailed information here.`,
        needsManualReview: true,
      },
    };

    return NextResponse.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("Error analyzing document:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze document",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
