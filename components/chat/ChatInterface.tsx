"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "./ChatMessage";
import type { IntakeFormData } from "@/types";
import { SendIcon, SparklesIcon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface VisaContext {
  code: string;
  name: string;
  country: string;
  category: string;
  description?: string;
  processingTimeAvg?: number;
  applicationFee?: number;
  currency?: string;
  requirements?: Array<{
    name: string;
    description: string;
    priority: string;
  }>;
  aiSummary?: string;
  confidenceScore?: number;
}

interface ChatInterfaceProps {
  userContext?: IntakeFormData | null;
  visaContext?: VisaContext | null;
}

export function ChatInterface({
  userContext,
  visaContext,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build initial welcome message based on context
  const getWelcomeMessage = (): Message => {
    if (visaContext) {
      return {
        id: "welcome",
        role: "assistant",
        content: `Hello! I see you're interested in the **${
          visaContext.name
        }** for ${visaContext.country}. 

${visaContext.aiSummary ? `Here's what I know: ${visaContext.aiSummary}` : ""}

I can help you with:
• Eligibility requirements and documents needed
• Application process and timeline
• Fees and costs breakdown
• Tips for a successful application
• Comparison with alternative visas

What would you like to know about this visa?`,
      };
    }

    return {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your VisaPath AI assistant. I can help you understand visa requirements, compare pathways, and answer any questions about your immigration journey. How can I help you today?",
    };
  };

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDocuments, setUserDocuments] = useState<
    Array<{
      type: string;
      fileName: string;
      status: string;
      details?: Record<string, string>;
    }>
  >([]);

  // Load user documents from localStorage (including details)
  useEffect(() => {
    const stored = localStorage.getItem("userDocuments");
    if (stored) {
      try {
        const docs = JSON.parse(stored);
        setUserDocuments(
          docs.map(
            (d: {
              type: string;
              fileName: string;
              status: string;
              details?: Record<string, string>;
            }) => ({
              type: d.type,
              fileName: d.fileName,
              status: d.status,
              details: d.details || {},
            })
          )
        );
      } catch (e) {
        console.error("Failed to load user documents:", e);
      }
    }
  }, []);

  // Update welcome message when visa context changes
  useEffect(() => {
    if (visaContext) {
      setMessages([getWelcomeMessage()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visaContext?.code]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext,
          visaContext,
          userDocuments, // Pass uploaded documents for context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: assistantContent }
                : m
            )
          );
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // Remove last assistant message if it's empty and retry
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last.role === "assistant" && !last.content) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  // Build suggested questions based on context
  const getSuggestedQuestions = (): string[] => {
    if (visaContext) {
      return [
        `What documents do I need for the ${visaContext.name}?`,
        `How long does ${visaContext.name} processing take?`,
        `What are the main requirements for this visa?`,
        `Are there faster alternatives to this visa?`,
      ];
    }

    return [
      "What visa options do I have for Germany?",
      "How long does the EU Blue Card take?",
      "What documents do I need for a work visa?",
      "Compare UK vs Netherlands visas",
    ];
  };

  const suggestedQuestions = getSuggestedQuestions();

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Visa Context Banner */}
      {visaContext && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <SparklesIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              Discussing: {visaContext.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {visaContext.country} • {visaContext.category} visa
            </p>
          </div>
          {visaContext.confidenceScore && (
            <Badge variant="outline" className="shrink-0 rounded-full px-3">
              {visaContext.confidenceScore}% verified
            </Badge>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border-2 border-border/50 bg-muted/10 p-5">
        <div className="space-y-5">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Spinner className="size-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">AI is thinking...</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border-2 border-destructive/20 bg-destructive/5 p-5 text-sm">
              <p className="text-destructive font-medium">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-3"
              >
                Retry
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={`suggestion-${index}`}
              type="button"
              onClick={() => handleSuggestionClick(question)}
              className="rounded-full border-2 border-border/50 bg-card px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={
              visaContext
                ? `Ask about ${visaContext.name}...`
                : "Ask about visa requirements, timelines, costs..."
            }
            disabled={isLoading}
            className="h-12 pr-4 rounded-xl border-2 focus-visible:ring-primary/20"
          />
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-12 w-12 rounded-xl shadow-md shadow-primary/20"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
