// Vercel AI Gateway model configurations
// Uses unified model strings: "provider/model-name"
// These strings are passed directly to generateText/streamText
export const MODELS = {
  CLAUDE_SONNET: "anthropic/claude-sonnet-4.5" as const,
  CLAUDE_HAIKU: "anthropic/claude-haiku-4.5" as const,
  GEMINI_PRO: "google/gemini-3-pro-preview" as const,
  GEMINI_FLASH: "google/gemini-2.0-flash" as const, // For vision/document scanning
} as const;

// Model string for different use cases
export const claudeModel = MODELS.CLAUDE_SONNET;
export const claudeHaikuModel = MODELS.CLAUDE_HAIKU;
export const geminiModel = MODELS.GEMINI_PRO;
export const geminiFlashModel = MODELS.GEMINI_FLASH;

// Default model for general use
export const defaultModel = claudeModel;

// Model configurations for different use cases
export const modelConfig = {
  eligibility: {
    model: MODELS.CLAUDE_SONNET,
    temperature: 0.3,
  },
  chat: {
    model: MODELS.CLAUDE_SONNET,
    temperature: 0.7,
  },
  document: {
    model: MODELS.CLAUDE_SONNET,
    temperature: 0.2,
  },
  cost: {
    model: MODELS.CLAUDE_HAIKU,
    temperature: 0.3,
  },
} as const;
