import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { visaTypes } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const visaTypesData = [
  // Germany
  {
    code: "de-blue-card",
    name: "EU Blue Card",
    country: "DE",
    category: "work",
    description:
      "EU Blue Card for highly qualified workers in Germany. Requires a recognized university degree and a job offer with minimum salary threshold.",
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeAvg: 60,
    applicationFee: 100,
    legalFee: 2000,
    currency: "EUR",
    successRate: 85,
    salaryThreshold: 56400,
    educationRequired: "bachelor",
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "University degree", priority: "critical" },
      { name: "Job offer meeting salary threshold", priority: "critical" },
      { name: "Health insurance", priority: "critical" },
      { name: "Valid passport", priority: "critical" },
      {
        name: "German language skills (optional but beneficial)",
        priority: "nice-to-have",
      },
    ]),
  },
  {
    code: "de-skilled-worker",
    name: "Skilled Worker Visa",
    country: "DE",
    category: "work",
    description:
      "For qualified workers with recognized professional training or university degree and a concrete job offer.",
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeAvg: 90,
    applicationFee: 75,
    legalFee: 1500,
    currency: "EUR",
    successRate: 78,
    salaryThreshold: 45000,
    educationRequired: "bachelor",
    languageRequirement: "basic",
    requirements: JSON.stringify([
      { name: "Recognized qualification", priority: "critical" },
      { name: "Job offer", priority: "critical" },
      { name: "German language skills (B1)", priority: "important" },
      { name: "Health insurance", priority: "critical" },
    ]),
  },

  // Netherlands
  {
    code: "nl-hsm",
    name: "Highly Skilled Migrant",
    country: "NL",
    category: "work",
    description:
      "For highly skilled workers with a recognized sponsor employer in Netherlands. One of the fastest work visa processes in EU.",
    processingTimeMin: 14,
    processingTimeMax: 60,
    processingTimeAvg: 30,
    applicationFee: 320,
    legalFee: 1500,
    currency: "EUR",
    successRate: 92,
    salaryThreshold: 46107,
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Job offer from recognized sponsor", priority: "critical" },
      { name: "Salary meeting threshold", priority: "critical" },
      { name: "Valid passport", priority: "critical" },
      { name: "Tuberculosis test (some nationalities)", priority: "important" },
    ]),
  },
  {
    code: "nl-orientation-visa",
    name: "Orientation Year Visa",
    country: "NL",
    category: "work",
    description:
      "For recent graduates of Dutch universities or top foreign universities to search for work in Netherlands.",
    processingTimeMin: 21,
    processingTimeMax: 90,
    processingTimeAvg: 45,
    applicationFee: 192,
    legalFee: 800,
    currency: "EUR",
    successRate: 88,
    salaryThreshold: null,
    educationRequired: "master",
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Recent graduation (within 3 years)", priority: "critical" },
      {
        name: "Degree from top 200 university or Dutch uni",
        priority: "critical",
      },
      { name: "Valid passport", priority: "critical" },
    ]),
  },

  // United Kingdom
  {
    code: "uk-skilled-worker",
    name: "Skilled Worker Visa",
    country: "UK",
    category: "work",
    description:
      "UK main work visa for skilled workers with a job offer from a licensed sponsor employer.",
    processingTimeMin: 21,
    processingTimeMax: 84,
    processingTimeAvg: 42,
    applicationFee: 719,
    legalFee: 3000,
    currency: "GBP",
    successRate: 80,
    salaryThreshold: 38700,
    educationRequired: "bachelor",
    languageRequirement: "intermediate",
    requirements: JSON.stringify([
      {
        name: "Certificate of Sponsorship from licensed employer",
        priority: "critical",
      },
      { name: "Job at required skill level (RQF 3+)", priority: "critical" },
      { name: "English language proficiency (B1)", priority: "critical" },
      { name: "Salary meeting threshold", priority: "critical" },
      { name: "Immigration Health Surcharge payment", priority: "critical" },
    ]),
  },
  {
    code: "uk-global-talent",
    name: "Global Talent Visa",
    country: "UK",
    category: "work",
    description:
      "For leaders and emerging talent in academia, arts, digital technology, or research.",
    processingTimeMin: 28,
    processingTimeMax: 56,
    processingTimeAvg: 35,
    applicationFee: 623,
    legalFee: 2500,
    currency: "GBP",
    successRate: 75,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Endorsement from approved body", priority: "critical" },
      {
        name: "Evidence of exceptional talent or promise",
        priority: "critical",
      },
      { name: "Valid passport", priority: "critical" },
    ]),
  },

  // United States
  {
    code: "us-h1b",
    name: "H-1B Specialty Occupation",
    country: "US",
    category: "work",
    description:
      "For specialty occupation workers in fields requiring theoretical and practical application of specialized knowledge.",
    processingTimeMin: 90,
    processingTimeMax: 270,
    processingTimeAvg: 180,
    applicationFee: 460,
    legalFee: 5000,
    currency: "USD",
    successRate: 35, // Due to lottery system
    salaryThreshold: 60000,
    educationRequired: "bachelor",
    languageRequirement: "advanced",
    requirements: JSON.stringify([
      { name: "Bachelor's degree or equivalent", priority: "critical" },
      { name: "Job offer in specialty occupation", priority: "critical" },
      { name: "Selected in H-1B lottery", priority: "critical" },
      { name: "Labor Condition Application (LCA)", priority: "critical" },
    ]),
  },
  {
    code: "us-o1",
    name: "O-1 Extraordinary Ability",
    country: "US",
    category: "work",
    description:
      "For individuals with extraordinary ability in sciences, arts, education, business, or athletics.",
    processingTimeMin: 14,
    processingTimeMax: 90,
    processingTimeAvg: 45,
    applicationFee: 460,
    legalFee: 6000,
    currency: "USD",
    successRate: 70,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Evidence of extraordinary ability", priority: "critical" },
      { name: "Coming to work in area of expertise", priority: "critical" },
      { name: "Advisory opinion from peer group", priority: "important" },
    ]),
  },
  {
    code: "us-l1",
    name: "L-1 Intracompany Transfer",
    country: "US",
    category: "work",
    description:
      "For managers, executives, or specialized knowledge workers transferring within the same company.",
    processingTimeMin: 30,
    processingTimeMax: 180,
    processingTimeAvg: 90,
    applicationFee: 460,
    legalFee: 4500,
    currency: "USD",
    successRate: 82,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Employed by company abroad for 1+ year", priority: "critical" },
      {
        name: "Manager/executive or specialized knowledge",
        priority: "critical",
      },
      { name: "US entity is related company", priority: "critical" },
    ]),
  },

  // Canada
  {
    code: "ca-express-entry",
    name: "Express Entry",
    country: "CA",
    category: "work",
    description:
      "Points-based immigration system for skilled workers. Fastest pathway to Canadian permanent residence.",
    processingTimeMin: 180,
    processingTimeMax: 365,
    processingTimeAvg: 240,
    applicationFee: 1365,
    legalFee: 3000,
    currency: "CAD",
    successRate: 78,
    salaryThreshold: null,
    educationRequired: "bachelor",
    languageRequirement: "advanced",
    requirements: JSON.stringify([
      { name: "Minimum CRS score (varies by draw)", priority: "critical" },
      { name: "Language test (IELTS/CELPIP)", priority: "critical" },
      { name: "Education credential assessment (ECA)", priority: "critical" },
      { name: "Proof of funds", priority: "important" },
      { name: "Work experience (1+ year skilled work)", priority: "critical" },
    ]),
  },
  {
    code: "ca-provincial-nominee",
    name: "Provincial Nominee Program",
    country: "CA",
    category: "work",
    description:
      "Provincial nomination for skilled workers to settle in specific Canadian provinces.",
    processingTimeMin: 120,
    processingTimeMax: 545,
    processingTimeAvg: 300,
    applicationFee: 1365,
    legalFee: 3500,
    currency: "CAD",
    successRate: 72,
    salaryThreshold: null,
    educationRequired: "bachelor",
    languageRequirement: "intermediate",
    requirements: JSON.stringify([
      { name: "Provincial nomination", priority: "critical" },
      { name: "Meet provincial criteria", priority: "critical" },
      { name: "Language test", priority: "critical" },
      { name: "Intent to live in nominating province", priority: "critical" },
    ]),
  },
  {
    code: "ca-global-talent-stream",
    name: "Global Talent Stream",
    country: "CA",
    category: "work",
    description:
      "Fast-track work permit for highly skilled tech workers and talent in unique occupations.",
    processingTimeMin: 10,
    processingTimeMax: 28,
    processingTimeAvg: 14,
    applicationFee: 155,
    legalFee: 2000,
    currency: "CAD",
    successRate: 88,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Job offer from designated employer", priority: "critical" },
      { name: "In-demand occupation or unique talent", priority: "critical" },
      { name: "Labour Market Benefits Plan", priority: "critical" },
    ]),
  },

  // Australia
  {
    code: "au-skilled-independent",
    name: "Skilled Independent Visa (189)",
    country: "AU",
    category: "work",
    description:
      "Points-based visa for skilled workers who don't need employer or state nomination.",
    processingTimeMin: 180,
    processingTimeMax: 540,
    processingTimeAvg: 365,
    applicationFee: 4640,
    legalFee: 4000,
    currency: "AUD",
    successRate: 65,
    salaryThreshold: null,
    educationRequired: "bachelor",
    languageRequirement: "advanced",
    requirements: JSON.stringify([
      { name: "Occupation on skilled occupation list", priority: "critical" },
      { name: "Skills assessment", priority: "critical" },
      { name: "Minimum 65 points", priority: "critical" },
      { name: "English proficiency (IELTS 6.0+)", priority: "critical" },
      { name: "Under 45 years old", priority: "critical" },
    ]),
  },
  {
    code: "au-employer-sponsored",
    name: "Employer Nomination Scheme (186)",
    country: "AU",
    category: "work",
    description:
      "Permanent residence visa for skilled workers nominated by an Australian employer.",
    processingTimeMin: 120,
    processingTimeMax: 365,
    processingTimeAvg: 240,
    applicationFee: 4640,
    legalFee: 3500,
    currency: "AUD",
    successRate: 82,
    salaryThreshold: 70000,
    educationRequired: "bachelor",
    languageRequirement: "intermediate",
    requirements: JSON.stringify([
      { name: "Employer nomination", priority: "critical" },
      { name: "Skills assessment", priority: "critical" },
      { name: "3+ years relevant work experience", priority: "critical" },
      { name: "English proficiency", priority: "critical" },
    ]),
  },

  // Digital Nomad Visas
  {
    code: "pt-d7",
    name: "Portugal D7 Visa",
    country: "PT",
    category: "digital-nomad",
    description:
      "Passive income or remote work visa for Portugal. Popular for digital nomads and retirees.",
    processingTimeMin: 60,
    processingTimeMax: 120,
    processingTimeAvg: 90,
    applicationFee: 90,
    legalFee: 1200,
    currency: "EUR",
    successRate: 85,
    salaryThreshold: 9120, // Monthly minimum
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Proof of regular passive income", priority: "critical" },
      { name: "Health insurance", priority: "critical" },
      { name: "Clean criminal record", priority: "critical" },
      { name: "Portuguese accommodation", priority: "critical" },
    ]),
  },
  {
    code: "es-digital-nomad",
    name: "Spain Digital Nomad Visa",
    country: "ES",
    category: "digital-nomad",
    description:
      "New digital nomad visa for remote workers employed by foreign companies.",
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeAvg: 45,
    applicationFee: 80,
    legalFee: 1500,
    currency: "EUR",
    successRate: 82,
    salaryThreshold: 27000, // Annual
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Remote work for non-Spanish company", priority: "critical" },
      { name: "3+ years work experience or degree", priority: "critical" },
      { name: "1+ year with current employer", priority: "important" },
      { name: "Health insurance", priority: "critical" },
    ]),
  },
  {
    code: "de-freelancer",
    name: "Germany Freelancer Visa",
    country: "DE",
    category: "digital-nomad",
    description:
      "Self-employment visa for freelancers and independent contractors in Germany.",
    processingTimeMin: 60,
    processingTimeMax: 180,
    processingTimeAvg: 90,
    applicationFee: 100,
    legalFee: 2000,
    currency: "EUR",
    successRate: 70,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "basic",
    requirements: JSON.stringify([
      { name: "Business plan", priority: "critical" },
      {
        name: "Client letters of intent from German companies",
        priority: "critical",
      },
      { name: "Sufficient funds", priority: "critical" },
      { name: "Health insurance", priority: "critical" },
      { name: "Professional qualifications", priority: "important" },
    ]),
  },

  // Study Visas
  {
    code: "de-student",
    name: "Germany Student Visa",
    country: "DE",
    category: "study",
    description:
      "Visa for full-time university studies at a German institution.",
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeAvg: 60,
    applicationFee: 75,
    legalFee: 500,
    currency: "EUR",
    successRate: 90,
    salaryThreshold: null,
    educationRequired: "high-school",
    languageRequirement: "intermediate",
    requirements: JSON.stringify([
      { name: "University admission letter", priority: "critical" },
      { name: "Proof of financial means (€11,208/year)", priority: "critical" },
      { name: "Health insurance", priority: "critical" },
      {
        name: "Language proficiency (German or English)",
        priority: "critical",
      },
    ]),
  },
  {
    code: "uk-student",
    name: "UK Student Visa",
    country: "UK",
    category: "study",
    description: "Visa for studies at UK higher education institutions.",
    processingTimeMin: 21,
    processingTimeMax: 42,
    processingTimeAvg: 21,
    applicationFee: 490,
    legalFee: 800,
    currency: "GBP",
    successRate: 88,
    salaryThreshold: null,
    educationRequired: "high-school",
    languageRequirement: "intermediate",
    requirements: JSON.stringify([
      {
        name: "Confirmation of Acceptance for Studies (CAS)",
        priority: "critical",
      },
      { name: "English language proficiency", priority: "critical" },
      { name: "Financial evidence", priority: "critical" },
      { name: "Immigration Health Surcharge", priority: "critical" },
    ]),
  },

  // Entrepreneur Visas
  {
    code: "uk-innovator",
    name: "UK Innovator Founder Visa",
    country: "UK",
    category: "entrepreneur",
    description:
      "For experienced businesspeople seeking to establish an innovative business in UK.",
    processingTimeMin: 21,
    processingTimeMax: 56,
    processingTimeAvg: 35,
    applicationFee: 1486,
    legalFee: 4000,
    currency: "GBP",
    successRate: 65,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "intermediate",
    requirements: JSON.stringify([
      { name: "Endorsement from approved body", priority: "critical" },
      {
        name: "Innovative, viable, and scalable business idea",
        priority: "critical",
      },
      { name: "English language proficiency (B2)", priority: "critical" },
      { name: "Minimum investment funds", priority: "important" },
    ]),
  },
  {
    code: "nl-startup",
    name: "Netherlands Startup Visa",
    country: "NL",
    category: "entrepreneur",
    description:
      "One-year visa to develop innovative products or services with a Dutch facilitator.",
    processingTimeMin: 30,
    processingTimeMax: 90,
    processingTimeAvg: 60,
    applicationFee: 350,
    legalFee: 2000,
    currency: "EUR",
    successRate: 75,
    salaryThreshold: null,
    educationRequired: null,
    languageRequirement: "none",
    requirements: JSON.stringify([
      { name: "Signed agreement with facilitator", priority: "critical" },
      { name: "Innovative product or service", priority: "critical" },
      { name: "Step-by-step plan for startup phase", priority: "critical" },
      { name: "Sufficient financial means", priority: "critical" },
    ]),
  },
];

export async function seed() {
  console.log("🌱 Seeding visa types...");

  for (const visa of visaTypesData) {
    await db.insert(visaTypes).values(visa).onConflictDoNothing();
    console.log(`  ✓ ${visa.name} (${visa.country})`);
  }

  console.log(`\n✅ Seeded ${visaTypesData.length} visa types`);
}

// Run if called directly
seed().catch(console.error);
