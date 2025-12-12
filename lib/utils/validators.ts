import { z } from "zod";
import { EducationLevel } from "@/types";

// Intake form validation schema
export const intakeFormSchema = z.object({
  currentCountry: z.string().min(1, "Please select your current country"),
  targetCountries: z
    .array(z.string())
    .min(1, "Please select at least one target country"),
  profession: z.string().min(1, "Please select your profession"),
  yearsExperience: z
    .number()
    .min(0, "Experience must be 0 or more")
    .max(50, "Please enter a valid number of years"),
  education: z.enum(
    [
      EducationLevel.HighSchool,
      EducationLevel.Bachelor,
      EducationLevel.Master,
      EducationLevel.PhD,
    ],
    {
      message: "Please select your education level",
    }
  ),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
  salary: z.number().min(0, "Salary must be a positive number"),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
});

export type IntakeFormSchema = z.infer<typeof intakeFormSchema>;

// Chat message validation
export const chatMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(4000),
  context: z
    .object({
      userProfileId: z.string().optional(),
      pathwayId: z.string().optional(),
    })
    .optional(),
});

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;

// Document upload validation
export const documentUploadSchema = z.object({
  type: z.enum([
    "passport",
    "degree",
    "work-certificate",
    "language-test",
    "medical",
    "police-clearance",
  ]),
  file: z.custom<File>((val) => val instanceof File, "Please upload a file"),
});

export type DocumentUploadSchema = z.infer<typeof documentUploadSchema>;

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

// Country code validation
export const isValidCountryCode = (code: string): boolean => {
  return /^[A-Z]{2,3}$/.test(code);
};
