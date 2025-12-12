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
    min: number;
    max: number;
    average: number;
  };
  cost: {
    applicationFee: number;
    legalFee?: number;
    currency: string;
  };
  successRate: number;
  salaryThreshold?: number;
  educationRequired?: EducationLevel;
  languageRequirement?: LanguageRequirement;
}

// Visa Pathway Result
export interface VisaPathway {
  id: string;
  userId: string;
  visaTypes: VisaType[];
  eligibilityScore: number;
  estimatedProcessingTime: number;
  totalCost: number;
  successProbability: number;
  recommendationRank: number;
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
  type:
    | "passport"
    | "degree"
    | "work-certificate"
    | "language-test"
    | "medical"
    | "police-clearance";
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

// Eligibility Analysis Result
export interface EligibilityResult {
  eligibilityScore: number;
  successProbability: number;
  recommendedVisaTypes: string[];
  missingRequirements: string[];
  timeline: number;
  reasoning: string;
  nextSteps: string[];
}

// Intake Form Data
export interface IntakeFormData {
  currentCountry: string;
  targetCountries: string[];
  profession: string;
  yearsExperience: number;
  education: EducationLevel;
  languages: string[];
  salary: number;
  email?: string;
}

export enum EducationLevel {
  HighSchool = "high-school",
  Bachelor = "bachelor",
  Master = "master",
  PhD = "phd",
}

export enum LanguageRequirement {
  None = "none",
  Basic = "basic",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export interface Requirement {
  name: string;
  met: boolean;
  priority: "critical" | "important" | "nice-to-have";
  suggestion?: string;
}

// Theme
export type Theme = "light" | "dark" | "system";
