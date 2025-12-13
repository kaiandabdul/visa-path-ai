import { streamText } from "ai";
import { NextRequest } from "next/server";
import { claudeModel, modelConfig } from "@/lib/ai/clients";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import {
  chatSessionQueries,
  chatMessageQueries,
  profileQueries,
  pathwayQueries,
} from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      userContext,
      visaContext,
      userDocuments, // Uploaded documents from client
      userId,
      sessionId,
      pathwayId,
      saveMessages = false,
    } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    // Fetch additional context from database if userId provided
    let enrichedContext = userContext || {};
    if (userId) {
      try {
        // Get user's active profile
        const profile = await profileQueries.getActiveByUserId(userId);
        if (profile) {
          enrichedContext = {
            ...enrichedContext,
            profile: {
              currentCountry: profile.currentCountry,
              targetCountries: profile.targetCountries,
              profession: profile.profession,
              yearsExperience: profile.yearsExperience,
              education: profile.education,
              languages: profile.languages,
              salary: profile.salary,
            },
          };
        }

        // Get user's pathways if pathwayId provided
        if (pathwayId) {
          const pathway = await pathwayQueries.getById(pathwayId);
          if (pathway) {
            enrichedContext = {
              ...enrichedContext,
              currentPathway: {
                eligibilityScore: pathway.eligibilityScore,
                successProbability: pathway.successProbability,
                estimatedProcessingTime: pathway.estimatedProcessingTime,
                reasoning: pathway.reasoning,
                visaTypes: pathway.visaTypes.map((pvt) => ({
                  name: pvt.visaType.name,
                  country: pvt.visaType.country,
                  category: pvt.visaType.category,
                })),
              },
            };
          }
        }
      } catch (dbError) {
        console.error("Failed to fetch context from database:", dbError);
        // Continue without DB context
      }
    }

    // Build context-aware system prompt
    let systemPrompt = CHAT_SYSTEM_PROMPT;

    // Add visa context if provided (user clicked "Ask AI about this visa")
    if (visaContext) {
      systemPrompt += `

CURRENT VISA CONTEXT:
The user is asking about a specific visa they were viewing:
- Visa Code: ${visaContext.code}
- Visa Name: ${visaContext.name}
- Country: ${visaContext.country}
- Category: ${visaContext.category}
${visaContext.description ? `- Description: ${visaContext.description}` : ""}
${
  visaContext.processingTimeAvg
    ? `- Average Processing Time: ${visaContext.processingTimeAvg} days`
    : ""
}
${
  visaContext.applicationFee
    ? `- Application Fee: ${visaContext.applicationFee} ${
        visaContext.currency || ""
      }`
    : ""
}
${visaContext.aiSummary ? `- Summary: ${visaContext.aiSummary}` : ""}
${
  visaContext.requirements?.length
    ? `- Key Requirements: ${visaContext.requirements
        .map((r: { name: string }) => r.name)
        .join(", ")}`
    : ""
}

Focus your answers on this specific visa. If the user asks about other visas, you can compare them to this one.`;
    }

    // Add user profile context if available
    if (Object.keys(enrichedContext).length > 0) {
      systemPrompt += `

USER CONTEXT:
${JSON.stringify(enrichedContext, null, 2)}

Use this context to provide personalized, relevant advice about their visa options. Reference their specific profile details when answering questions.`;
    }

    // Add uploaded documents context if available
    if (
      userDocuments &&
      Array.isArray(userDocuments) &&
      userDocuments.length > 0
    ) {
      const docSummary = userDocuments
        .map(
          (doc: { type: string; fileName: string; status: string }) =>
            `- ${doc.type}: ${doc.fileName} (${doc.status})`
        )
        .join("\n");

      systemPrompt += `

UPLOADED DOCUMENTS:
The user has uploaded the following documents that you can reference:
${docSummary}

When discussing visa requirements, you can mention which of their documents might be relevant or if any are missing.`;
    }

    // Stream the response using AI SDK v6
    const result = streamText({
      model: claudeModel,
      system: systemPrompt,
      messages,
      temperature: modelConfig.chat.temperature,
      onFinish: async ({ text }) => {
        // Save messages to database if requested and userId provided
        if (saveMessages && userId) {
          try {
            // Get or create session
            const session = sessionId
              ? await chatSessionQueries.getById(sessionId)
              : await chatSessionQueries.getOrCreateActive(userId, pathwayId);

            if (session) {
              // Get the last user message
              const lastUserMessage = messages[messages.length - 1];

              // Save user message
              await chatMessageQueries.create({
                sessionId: session.id,
                role: "user",
                content: lastUserMessage.content,
              });

              // Save assistant response
              await chatMessageQueries.create({
                sessionId: session.id,
                role: "assistant",
                content: text,
              });
            }
          } catch (saveError) {
            console.error("Failed to save messages:", saveError);
          }
        }
      },
    });

    // Return the streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat streaming error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new Response("AI service configuration error", { status: 500 });
      }
      if (error.message.includes("rate limit")) {
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
        });
      }
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
