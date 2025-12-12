// Target countries for visa pathways
export const TARGET_COUNTRIES = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
] as const;

// Common languages for visa applications
export const LANGUAGES = [
  "English",
  "German",
  "French",
  "Spanish",
  "Portuguese",
  "Dutch",
  "Italian",
  "Japanese",
  "Mandarin",
  "Arabic",
  "Hindi",
  "Russian",
] as const;

// Visa categories
export const VISA_CATEGORIES = [
  { id: "work", name: "Work Visa", icon: "💼" },
  { id: "study", name: "Study Visa", icon: "🎓" },
  { id: "entrepreneur", name: "Entrepreneur Visa", icon: "🚀" },
  { id: "digital-nomad", name: "Digital Nomad Visa", icon: "💻" },
  { id: "family", name: "Family Visa", icon: "👨‍👩‍👧‍👦" },
] as const;

// Education levels
export const EDUCATION_LEVELS = [
  { value: "high-school", label: "High School" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD / Doctorate" },
] as const;

// Experience ranges
export const EXPERIENCE_RANGES = [
  { value: 0, label: "Entry Level (0-1 years)" },
  { value: 2, label: "Junior (2-3 years)" },
  { value: 4, label: "Mid-Level (4-6 years)" },
  { value: 7, label: "Senior (7-10 years)" },
  { value: 10, label: "Expert (10+ years)" },
] as const;

// Salary ranges (in USD)
export const SALARY_RANGES = [
  { value: 30000, label: "$30,000 - $50,000" },
  { value: 50000, label: "$50,000 - $75,000" },
  { value: 75000, label: "$75,000 - $100,000" },
  { value: 100000, label: "$100,000 - $150,000" },
  { value: 150000, label: "$150,000+" },
] as const;

// Profession categories
export const PROFESSIONS = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Designer (UX/UI)",
  "Marketing Manager",
  "Finance Professional",
  "Healthcare Professional",
  "Researcher/Academic",
  "Entrepreneur",
  "Consultant",
  "Engineer (Other)",
  "Other",
] as const;

// App constants
export const APP_NAME = "VisaPath AI";
export const APP_DESCRIPTION =
  "Your AI-powered guide to navigating international visa pathways";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// API routes
export const API_ROUTES = {
  eligibility: "/api/ai/eligibility",
  chat: "/api/ai/chat",
  documents: "/api/ai/documents",
  timeline: "/api/ai/timeline",
  cost: "/api/ai/cost",
  health: "/api/health",
} as const;

// Dashboard navigation
export const DASHBOARD_NAV = [
  { name: "Dashboard", href: "/dashboard", icon: "home" },
  { name: "Intake Form", href: "/dashboard/intake", icon: "clipboard" },
  { name: "Results", href: "/dashboard/results", icon: "chart" },
  { name: "Timeline", href: "/dashboard/timeline", icon: "calendar" },
  { name: "Profile", href: "/dashboard/profile", icon: "user" },
  { name: "Documents", href: "/dashboard/documents", icon: "file" },
  { name: "AI Chat", href: "/dashboard/chat", icon: "message" },
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
] as const;
