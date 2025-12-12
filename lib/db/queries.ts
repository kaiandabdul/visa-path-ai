import { eq, desc, and, inArray } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  userProfiles,
  visaTypes,
  visaPathways,
  pathwayVisaTypes,
  documents,
  chatSessions,
  chatMessages,
  pathwayComparisons,
  type NewUser,
  type NewUserProfile,
  type NewVisaPathway,
  type NewDocument,
  type NewChatSession,
  type NewChatMessage,
} from "./schema";

// ============================================
// USER QUERIES
// ============================================
export const userQueries = {
  async create(data: NewUser) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async getById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        profiles: true,
        pathways: true,
      },
    });
  },

  async getByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  async getOrCreate(email: string, name?: string) {
    let user = await this.getByEmail(email);
    if (!user) {
      user = await this.create({ email, name });
    }
    return user;
  },
};

// ============================================
// USER PROFILE QUERIES
// ============================================
export const profileQueries = {
  async create(data: NewUserProfile) {
    const [profile] = await db.insert(userProfiles).values(data).returning();
    return profile;
  },

  async getById(id: string) {
    return db.query.userProfiles.findFirst({
      where: eq(userProfiles.id, id),
      with: {
        user: true,
        pathways: true,
      },
    });
  },

  async getByUserId(userId: string) {
    return db.query.userProfiles.findMany({
      where: eq(userProfiles.userId, userId),
      orderBy: [desc(userProfiles.createdAt)],
    });
  },

  async getActiveByUserId(userId: string) {
    return db.query.userProfiles.findFirst({
      where: and(
        eq(userProfiles.userId, userId),
        eq(userProfiles.isActive, true)
      ),
    });
  },

  async update(id: string, data: Partial<NewUserProfile>) {
    const [profile] = await db
      .update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.id, id))
      .returning();
    return profile;
  },
};

// ============================================
// VISA TYPE QUERIES
// ============================================
export const visaTypeQueries = {
  async getAll() {
    return db.query.visaTypes.findMany({
      where: eq(visaTypes.isActive, true),
      orderBy: [desc(visaTypes.successRate)],
    });
  },

  async getById(id: string) {
    return db.query.visaTypes.findFirst({
      where: eq(visaTypes.id, id),
    });
  },

  async getByCode(code: string) {
    return db.query.visaTypes.findFirst({
      where: eq(visaTypes.code, code),
    });
  },

  async getByCountry(country: string) {
    return db.query.visaTypes.findMany({
      where: and(eq(visaTypes.country, country), eq(visaTypes.isActive, true)),
    });
  },

  async getByCategory(category: string) {
    return db.query.visaTypes.findMany({
      where: and(
        eq(visaTypes.category, category),
        eq(visaTypes.isActive, true)
      ),
    });
  },

  async getByCountries(countries: string[]) {
    return db.query.visaTypes.findMany({
      where: and(
        inArray(visaTypes.country, countries),
        eq(visaTypes.isActive, true)
      ),
    });
  },
};

// ============================================
// VISA PATHWAY QUERIES
// ============================================
export const pathwayQueries = {
  async create(data: NewVisaPathway, visaTypeIds: string[]) {
    const [pathway] = await db.insert(visaPathways).values(data).returning();

    // Create junction table entries
    if (visaTypeIds.length > 0) {
      await db.insert(pathwayVisaTypes).values(
        visaTypeIds.map((visaTypeId, index) => ({
          pathwayId: pathway.id,
          visaTypeId,
          order: index,
        }))
      );
    }

    return pathway;
  },

  async getById(id: string) {
    return db.query.visaPathways.findFirst({
      where: eq(visaPathways.id, id),
      with: {
        profile: true,
        visaTypes: {
          with: {
            visaType: true,
          },
        },
      },
    });
  },

  async getByUserId(userId: string) {
    return db.query.visaPathways.findMany({
      where: eq(visaPathways.userId, userId),
      orderBy: [desc(visaPathways.createdAt)],
      with: {
        visaTypes: {
          with: {
            visaType: true,
          },
        },
      },
    });
  },

  async getByProfileId(profileId: string) {
    return db.query.visaPathways.findMany({
      where: eq(visaPathways.profileId, profileId),
      orderBy: [desc(visaPathways.recommendationRank)],
      with: {
        visaTypes: {
          with: {
            visaType: true,
          },
        },
      },
    });
  },

  async updateStatus(id: string, status: string) {
    const [pathway] = await db
      .update(visaPathways)
      .set({ status })
      .where(eq(visaPathways.id, id))
      .returning();
    return pathway;
  },
};

// ============================================
// DOCUMENT QUERIES
// ============================================
export const documentQueries = {
  async create(data: NewDocument) {
    const [document] = await db.insert(documents).values(data).returning();
    return document;
  },

  async getById(id: string) {
    return db.query.documents.findFirst({
      where: eq(documents.id, id),
    });
  },

  async getByUserId(userId: string) {
    return db.query.documents.findMany({
      where: eq(documents.userId, userId),
      orderBy: [desc(documents.createdAt)],
    });
  },

  async update(id: string, data: Partial<NewDocument>) {
    const [document] = await db
      .update(documents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return document;
  },

  async delete(id: string) {
    await db.delete(documents).where(eq(documents.id, id));
  },
};

// ============================================
// CHAT SESSION QUERIES
// ============================================
export const chatSessionQueries = {
  async create(data: NewChatSession) {
    const [session] = await db.insert(chatSessions).values(data).returning();
    return session;
  },

  async getById(id: string) {
    return db.query.chatSessions.findFirst({
      where: eq(chatSessions.id, id),
      with: {
        messages: {
          orderBy: [chatMessages.createdAt],
        },
      },
    });
  },

  async getByUserId(userId: string) {
    return db.query.chatSessions.findMany({
      where: and(
        eq(chatSessions.userId, userId),
        eq(chatSessions.isActive, true)
      ),
      orderBy: [desc(chatSessions.updatedAt)],
    });
  },

  async getOrCreateActive(userId: string, pathwayId?: string) {
    // Find existing active session
    let session = await db.query.chatSessions.findFirst({
      where: and(
        eq(chatSessions.userId, userId),
        eq(chatSessions.isActive, true),
        pathwayId ? eq(chatSessions.pathwayId, pathwayId) : undefined
      ),
    });

    if (!session) {
      session = await this.create({
        userId,
        pathwayId,
        title: pathwayId ? "Pathway Discussion" : "General Chat",
      });
    }

    return session;
  },

  async updateTitle(id: string, title: string) {
    const [session] = await db
      .update(chatSessions)
      .set({ title, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  },
};

// ============================================
// CHAT MESSAGE QUERIES
// ============================================
export const chatMessageQueries = {
  async create(data: NewChatMessage) {
    const [message] = await db.insert(chatMessages).values(data).returning();

    // Update session timestamp
    await db
      .update(chatSessions)
      .set({ updatedAt: new Date() })
      .where(eq(chatSessions.id, data.sessionId));

    return message;
  },

  async getBySessionId(sessionId: string, limit = 50) {
    return db.query.chatMessages.findMany({
      where: eq(chatMessages.sessionId, sessionId),
      orderBy: [chatMessages.createdAt],
      limit,
    });
  },

  async createMany(messages: NewChatMessage[]) {
    return db.insert(chatMessages).values(messages).returning();
  },
};

// ============================================
// PATHWAY COMPARISON QUERIES
// ============================================
export const comparisonQueries = {
  async create(userId: string, pathwayIds: string[], title?: string) {
    const [comparison] = await db
      .insert(pathwayComparisons)
      .values({ userId, pathwayIds, title })
      .returning();
    return comparison;
  },

  async getByUserId(userId: string) {
    return db.query.pathwayComparisons.findMany({
      where: eq(pathwayComparisons.userId, userId),
      orderBy: [desc(pathwayComparisons.createdAt)],
    });
  },
};
