import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  authUsers,
  accounts,
  sessions,
  verificationTokens,
} from "./db/auth-schema";

// Create a direct database connection for Auth.js
// This bypasses the lazy proxy to give the adapter a real Drizzle instance
function getAuthDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(getAuthDb(), {
    usersTable: authUsers,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Demo credentials provider for testing without OAuth
    Credentials({
      name: "Demo",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@example.com",
        },
      },
      async authorize(credentials) {
        // For demo purposes only - creates a mock user
        if (credentials?.email) {
          return {
            id: `demo-${Date.now()}`,
            email: credentials.email as string,
            name: "Demo User",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  trustHost: true,
});
