# VisaPath AI - Project Scaffold Prompt for Claude Code

## Context
You are scaffolding a production-ready VisaPath AI application using Next.js 16 and AI SDK v6. The project is a visa pathway advisor that uses Claude AI to help professionals navigate international relocation. You have 9 days to build an MVP.

**Tech Stack:**
- Next.js 16 (App Router)
- AI SDK v6 (Vercel)
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon recommended)
- Convex (optional for real-time sync)

---

## Project Overview

### Core MVP Features
1. **Intake & Profile Builder** - Collects user info and determines visa eligibility
2. **Smart Document Assistant** - Scans documents and generates compliant content
3. **Visa Timeline Forecaster** - Predicts processing times
4. **Cost Calculator** - Estimates relocation costs
5. **Interactive Visa Pathway Map** - Visualizes journey
6. **AI Chat Agent** - Conversational interface
7. **Results Dashboard** - Shows recommended pathways with success rates

### Market Problem
- Visa processes take 3-6 months, cost €5K-15K, have 20-30% rejection rates
- Users are confused about eligibility and requirements
- No clear tool shows the complete journey from start to finish

---

## Directory Structure

```
visa-path-ai/
├── app/
│   ├── layout.tsx                 # Root layout with auth context
│   ├── page.tsx                   # Landing page
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── intake/
│   │   │   ├── page.tsx          # User profile form
│   │   │   └── layout.tsx
│   │   ├── results/
│   │   │   ├── page.tsx          # Visa pathway results
│   │   │   └── [id]/page.tsx     # Individual pathway detail
│   │   ├── documents/
│   │   │   └── page.tsx          # Document upload & generation
│   │   ├── chat/
│   │   │   └── page.tsx          # AI chat interface
│   │   └── settings/
│   │       └── page.tsx          # User settings
│   └── api/
│       ├── ai/
│       │   ├── eligibility/route.ts      # Claude eligibility analysis
│       │   ├── documents/route.ts        # Document processing
│       │   ├── chat/route.ts             # Streaming chat endpoint
│       │   ├── timeline/route.ts         # Processing time forecast
│       │   └── cost/route.ts             # Cost calculation
│       ├── auth/
│       │   ├── [...nextauth]/route.ts    # NextAuth endpoints
│       │   ├── signin/route.ts
│       │   └── callback/route.ts
│       ├── users/
│       │   ├── route.ts                  # User CRUD
│       │   └── [id]/route.ts
│       └── health/route.ts               # Health check
├── lib/
│   ├── ai/
│   │   ├── clients.ts            # AI SDK initialization
│   │   ├── prompts.ts            # System prompts for Claude
│   │   ├── eligibility.ts        # Eligibility logic
│   │   └── tools.ts              # Tool definitions
│   ├── db/
│   │   ├── db.ts                 # Database connection
│   │   ├── queries.ts            # SQL queries
│   │   └── schema.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── validators.ts         # Input validation
│   │   ├── formatters.ts         # Data formatting
│   │   └── constants.ts          # App constants
│   └── hooks/
│       ├── useUser.ts            # User context hook
│       └── useAI.ts              # AI interaction hook
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   │   ├── IntakeForm.tsx        # User profile input
│   │   └── DocumentUpload.tsx
│   ├── results/
│   │   ├── PathwayCard.tsx       # Individual pathway card
│   │   ├── PathwayComparison.tsx # Side-by-side comparison
│   │   └── PathwayTimeline.tsx   # Timeline visualization
│   ├── chat/
│   │   ├── ChatInterface.tsx     # Chat UI
│   │   └── ChatMessage.tsx
│   ├── ui/
│   │   ├── Button.tsx            # Reusable components
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Alert.tsx
│   └── common/
│       ├── LoadingState.tsx
│       └── ErrorBoundary.tsx
├── types/
│   ├── index.ts                  # All type exports
│   ├── user.ts
│   ├── visa.ts
│   ├── document.ts
│   └── ai.ts
├── styles/
│   ├── globals.css               # Tailwind + custom
│   └── variables.css             # CSS custom properties
├── public/
│   ├── images/
│   ├── icons/
│   └── data/                     # Visa types JSON data
├── .env.local                    # Environment variables (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Type Definitions (types/index.ts)

```typescript
// User Profile
export interface UserProfile {
  id: string;
  email: string;
  createdAt: Date;
  currentCountry: string;
  targetCountries: string[];
  profession: string;
  yearsExperience: number;
  education: EducationLevel;
  languages: string[];
  salary: number;
  visaHistory?: string[];
}

// Visa Type
export interface VisaType {
  id: string;
  name: string;
  country: string;
  category: "work" | "study" | "entrepreneur" | "digital-nomad" | "family";
  requirements: Requirement[];
  processingTime: {
    min: number; // days
    max: number;
    average: number;
  };
  cost: {
    applicationFee: number;
    legalFee?: number;
    currency: string;
  };
  successRate: number; // 0-100
  salaryThreshold?: number;
  educationRequired?: EducationLevel;
  languageRequirement?: LanguageRequirement;
}

// Visa Pathway Result
export interface VisaPathway {
  id: string;
  userId: string;
  visaTypes: VisaType[];
  eligibilityScore: number; // 0-100
  estimatedProcessingTime: number; // days
  totalCost: number;
  successProbability: number; // 0-100
  recommendationRank: number; // 1, 2, 3
  reasoning: string;
  nextSteps: string[];
  riskFactors: string[];
  alternativePaths?: VisaPathway[];
  createdAt: Date;
}

// Document
export interface Document {
  id: string;
  userId: string;
  type: "passport" | "degree" | "work-certificate" | "language-test" | "medical" | "police-clearance";
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  extractedData?: Record<string, unknown>;
  status: "pending" | "processed" | "error";
}

// Chat Message
export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: {
    userProfileId: string;
    pathwayId?: string;
  };
}

// AI Response
export interface AIResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
  };
}

export enum EducationLevel {
  HighSchool = "high-school",
  Bachelor = "bachelor",
  Master = "master",
  PhD = "phd",
}

export enum LanguageRequirement {
  None = "none",
  Basic = "basic", // A2
  Intermediate = "intermediate", // B1
  Advanced = "advanced", // B2+
}

export interface Requirement {
  name: string;
  met: boolean;
  priority: "critical" | "important" | "nice-to-have";
  suggestion?: string;
}
```

---

## AI Integration (lib/ai/clients.ts)

```typescript
import { Anthropic } from "@anthropic-ai/sdk";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, streamText, generateText } from "ai";

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const claudeModel = "claude-3-5-sonnet-20241022";
export const gptModel = "gpt-4o";

// For use with AI SDK
export const claudeAISDK = anthropic("claude-3-5-sonnet-20241022");
export const gptAISDK = openai(gptModel);
```

---

## System Prompts (lib/ai/prompts.ts)

```typescript
export const ELIGIBILITY_SYSTEM_PROMPT = `You are an expert immigration consultant with 15+ years of experience. 
Analyze user profiles against visa requirements and provide clear, actionable eligibility assessments.
Focus on: eligibility score, success probability, missing requirements, and realistic timelines.
Be specific about requirements and never give generic advice.`;

export const DOCUMENT_ANALYSIS_PROMPT = `You are a document analyst specializing in visa applications.
Extract key information from documents and identify missing elements required for specific visas.
Flag compliance risks and suggest improvements to strengthen applications.`;

export const CHAT_SYSTEM_PROMPT = `You are VisaPath AI, a helpful visa pathway advisor assistant.
Help users understand their visa options, requirements, and next steps.
Be conversational, empathetic, and practical. Reference their profile data when available.
Always be honest about timelines, costs, and success rates.`;

export const COST_CALCULATOR_PROMPT = `You are a relocation cost estimator.
Calculate: visa fees, legal fees, moving costs, housing deposits, cost of living differences.
Provide realistic estimates based on actual data.
Compare different pathways and show ROI calculations.`;
```

---

## Database Schema (lib/db/schema.ts)

```typescript
// PostgreSQL schema (Neon recommended)
export const DATABASE_SCHEMA = `
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_country VARCHAR(100) NOT NULL,
  target_countries TEXT[] NOT NULL,
  profession VARCHAR(255) NOT NULL,
  years_experience INTEGER,
  education_level VARCHAR(50),
  languages TEXT[],
  salary DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visa_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  requirements JSONB NOT NULL,
  processing_time_min INTEGER,
  processing_time_max INTEGER,
  processing_time_avg INTEGER,
  application_fee DECIMAL(10, 2),
  success_rate DECIMAL(3, 2),
  salary_threshold DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visa_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  visa_type_ids UUID[],
  eligibility_score DECIMAL(3, 2),
  estimated_processing_time INTEGER,
  total_cost DECIMAL(10, 2),
  success_probability DECIMAL(3, 2),
  ranking INTEGER,
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  extracted_data JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_visa_pathways_user_id ON visa_pathways(user_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
`;
```

---

## API Endpoint Example: Eligibility (app/api/ai/eligibility/route.ts)

```typescript
import { generateObject } from "ai";
import { claudeAISDK } from "@/lib/ai/clients";
import { ELIGIBILITY_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const EligibilitySchema = z.object({
  eligibilityScore: z.number().min(0).max(100),
  successProbability: z.number().min(0).max(100),
  recommendedVisaTypes: z.array(z.string()),
  missingRequirements: z.array(z.string()),
  timeline: z.number(), // days
  reasoning: z.string(),
  nextSteps: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userProfile, visaTypes } = body;

    const result = await generateObject({
      model: claudeAISDK,
      system: ELIGIBILITY_SYSTEM_PROMPT,
      prompt: `
        User Profile:
        - Current Country: ${userProfile.currentCountry}
        - Target Countries: ${userProfile.targetCountries.join(", ")}
        - Profession: ${userProfile.profession}
        - Years Experience: ${userProfile.yearsExperience}
        - Education: ${userProfile.education}
        - Languages: ${userProfile.languages.join(", ")}
        - Salary: ${userProfile.salary}

        Available Visa Types: ${JSON.stringify(visaTypes, null, 2)}

        Analyze eligibility for each visa type and provide recommendations.
      `,
      schema: EligibilitySchema,
    });

    return NextResponse.json({
      success: true,
      data: result.object,
    });
  } catch (error) {
    console.error("Eligibility analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze eligibility" },
      { status: 500 }
    );
  }
}
```

---

## Streaming Chat Endpoint (app/api/ai/chat/route.ts)

```typescript
import { streamText } from "ai";
import { claudeAISDK } from "@/lib/ai/clients";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();

    const result = streamText({
      model: claudeAISDK,
      system: `${CHAT_SYSTEM_PROMPT}\n\nUser Context: ${JSON.stringify(userContext)}`,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat streaming error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

---

## Environment Variables (.env.local)

```env
# AI/LLM
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:password@neon.tech/database
POSTGRES_URL=postgresql://user:password@neon.tech/database

# Auth (NextAuth v5)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Initial Scaffold Checklist

### Phase 1: Foundation (Day 1)
- [ ] Create all directories and files
- [ ] Set up database connection
- [ ] Configure AI SDK clients
- [ ] Build landing page + basic layout

### Phase 2: Intake & Eligibility (Days 2-3)
- [ ] Build IntakeForm component
- [ ] Create eligibility API endpoint
- [ ] Build results display
- [ ] Connect frontend to backend

### Phase 3: Document & Chat (Days 4-5)
- [ ] Build document upload component
- [ ] Create document processing API
- [ ] Build chat interface
- [ ] Implement streaming chat endpoint

### Phase 4: Visualizations & Polish (Days 6-7)
- [ ] Build pathway comparison cards
- [ ] Create timeline visualization
- [ ] Add cost calculator
- [ ] Polish UI/UX

### Phase 5: Demo Prep (Days 8-9)
- [ ] Deploy to Vercel
- [ ] Create demo video
- [ ] Write documentation
- [ ] Final testing

---

## Running the Prompt

**In Claude Code, paste this entire message and say:**

> "Use this specification to scaffold the VisaPath AI project. Create all the directories, files, and initial code for a Next.js 16 app with TypeScript using AI SDK v6 and Anthropic Claude. Start with:
> 1. Directory structure
> 2. TypeScript types
> 3. Environment setup (next.config.ts, tailwind.config.ts)
> 4. Root layout.tsx with providers
> 5. Landing page (page.tsx)
> 6. Intake form component and page
> 7. First API endpoint (eligibility analysis)
> 8. Basic reusable UI components
>
> Focus on production-ready code with proper error handling, TypeScript types, and best practices. Use the design system with Tailwind CSS utilities (dark mode support). Make it ready for AI SDK v6 streaming capabilities."

---

## Quick Start After Scaffold

```bash
# Install dependencies
npm install

# Set up .env.local with your keys
# Run database migrations
npm run db:migrate

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## Success Metrics

✅ All directories created
✅ TypeScript types fully defined
✅ AI SDK properly configured
✅ Database schema ready
✅ First API endpoint functional
✅ UI components scaffolded
✅ Streaming chat ready to test
✅ Dark mode support included

**You're now ready to build your MVP in 9 days!**
