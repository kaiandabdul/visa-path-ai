import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(userProfiles),
  pathways: many(visaPathways),
  documents: many(documents),
  chatSessions: many(chatSessions),
}));

// ============================================
// USER PROFILES TABLE (Intake Form Data)
// ============================================
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  currentCountry: varchar("current_country", { length: 2 }).notNull(),
  targetCountries: text("target_countries").array().notNull(),
  profession: varchar("profession", { length: 255 }).notNull(),
  yearsExperience: integer("years_experience").notNull(),
  education: varchar("education", { length: 50 }).notNull(),
  languages: text("languages").array().notNull(),
  salary: integer("salary").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfilesRelations = relations(
  userProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userProfiles.userId],
      references: [users.id],
    }),
    pathways: many(visaPathways),
  })
);

// ============================================
// VISA TYPES TABLE
// ============================================
export const visaTypes = pgTable("visa_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // work, study, entrepreneur, digital-nomad, family
  description: text("description"),

  // Processing times in days
  processingTimeMin: integer("processing_time_min").notNull(),
  processingTimeMax: integer("processing_time_max").notNull(),
  processingTimeAvg: integer("processing_time_avg").notNull(),

  // Costs
  applicationFee: integer("application_fee").notNull(),
  legalFee: integer("legal_fee"),
  currency: varchar("currency", { length: 3 }).notNull().default("EUR"),

  // Requirements
  successRate: integer("success_rate").notNull(), // percentage 0-100
  salaryThreshold: integer("salary_threshold"),
  educationRequired: varchar("education_required", { length: 50 }),
  languageRequirement: varchar("language_requirement", { length: 50 }),
  requirements: jsonb("requirements").notNull().default([]),

  // Metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visaTypesRelations = relations(visaTypes, ({ many }) => ({
  pathwayVisaTypes: many(pathwayVisaTypes),
}));

// ============================================
// VISA PATHWAYS TABLE (AI Analysis Results)
// ============================================
export const visaPathways = pgTable("visa_pathways", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").references(() => userProfiles.id, {
    onDelete: "cascade",
  }),

  // Analysis results
  eligibilityScore: integer("eligibility_score").notNull(),
  estimatedProcessingTime: integer("estimated_processing_time").notNull(), // days
  totalCost: integer("total_cost").notNull(),
  successProbability: integer("success_probability").notNull(), // percentage
  recommendationRank: integer("recommendation_rank").notNull(),

  // AI-generated content
  reasoning: text("reasoning").notNull(),
  nextSteps: text("next_steps").array().notNull(),
  riskFactors: text("risk_factors").array().notNull(),

  // Status
  status: varchar("status", { length: 20 }).default("active"), // active, archived, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visaPathwaysRelations = relations(
  visaPathways,
  ({ one, many }) => ({
    user: one(users, {
      fields: [visaPathways.userId],
      references: [users.id],
    }),
    profile: one(userProfiles, {
      fields: [visaPathways.profileId],
      references: [userProfiles.id],
    }),
    visaTypes: many(pathwayVisaTypes),
    chatSessions: many(chatSessions),
  })
);

// ============================================
// PATHWAY_VISA_TYPES (Junction Table)
// ============================================
export const pathwayVisaTypes = pgTable("pathway_visa_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  pathwayId: uuid("pathway_id")
    .references(() => visaPathways.id, { onDelete: "cascade" })
    .notNull(),
  visaTypeId: uuid("visa_type_id")
    .references(() => visaTypes.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

export const pathwayVisaTypesRelations = relations(
  pathwayVisaTypes,
  ({ one }) => ({
    pathway: one(visaPathways, {
      fields: [pathwayVisaTypes.pathwayId],
      references: [visaPathways.id],
    }),
    visaType: one(visaTypes, {
      fields: [pathwayVisaTypes.visaTypeId],
      references: [visaTypes.id],
    }),
  })
);

// ============================================
// DOCUMENTS TABLE
// ============================================
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  type: varchar("type", { length: 50 }).notNull(), // passport, degree, work-certificate, etc.
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(), // bytes
  mimeType: varchar("mime_type", { length: 100 }),

  // AI extraction results
  extractedData: jsonb("extracted_data"),
  aiAnalysis: text("ai_analysis"),

  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, processing, processed, error
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

// ============================================
// CHAT SESSIONS TABLE
// ============================================
export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  pathwayId: uuid("pathway_id").references(() => visaPathways.id, {
    onDelete: "set null",
  }),

  title: varchar("title", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatSessionsRelations = relations(
  chatSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [chatSessions.userId],
      references: [users.id],
    }),
    pathway: one(visaPathways, {
      fields: [chatSessions.pathwayId],
      references: [visaPathways.id],
    }),
    messages: many(chatMessages),
  })
);

// ============================================
// CHAT MESSAGES TABLE
// ============================================
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => chatSessions.id, { onDelete: "cascade" })
    .notNull(),

  role: varchar("role", { length: 20 }).notNull(), // user, assistant
  content: text("content").notNull(),

  // Optional metadata
  tokensUsed: integer("tokens_used"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

// ============================================
// PATHWAY COMPARISONS TABLE (Saved Comparisons)
// ============================================
export const pathwayComparisons = pgTable("pathway_comparisons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  pathwayIds: uuid("pathway_ids").array().notNull(),
  title: varchar("title", { length: 255 }),
  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pathwayComparisonsRelations = relations(
  pathwayComparisons,
  ({ one }) => ({
    user: one(users, {
      fields: [pathwayComparisons.userId],
      references: [users.id],
    }),
  })
);

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type VisaType = typeof visaTypes.$inferSelect;
export type NewVisaType = typeof visaTypes.$inferInsert;

export type VisaPathway = typeof visaPathways.$inferSelect;
export type NewVisaPathway = typeof visaPathways.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type PathwayComparison = typeof pathwayComparisons.$inferSelect;
export type NewPathwayComparison = typeof pathwayComparisons.$inferInsert;
