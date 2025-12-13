"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import type { IntakeFormData } from "@/types";
import { Spinner } from "@/components/ui/spinner";

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

function ChatContent() {
  const searchParams = useSearchParams();
  const visaCode = searchParams.get("visa");

  const [userContext, setUserContext] = useState<IntakeFormData | null>(null);
  const [visaContext, setVisaContext] = useState<VisaContext | null>(null);
  const [isLoadingVisa, setIsLoadingVisa] = useState(false);

  // Load user profile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      setUserContext(JSON.parse(stored));
    }
  }, []);

  // Fetch visa details if visa code is present
  useEffect(() => {
    async function fetchVisaDetails() {
      if (!visaCode) return;

      setIsLoadingVisa(true);
      try {
        const response = await fetch(`/api/ai/research/${visaCode}`);
        const data = await response.json();

        if (data.success && data.data) {
          const { visa, research } = data.data;
          setVisaContext({
            code: visa.code,
            name: visa.name,
            country: visa.country,
            category: visa.category,
            description: visa.description,
            processingTimeAvg: visa.processingTimeAvg,
            applicationFee: visa.applicationFee,
            currency: visa.currency,
            requirements: research?.officialRequirements?.slice(0, 5),
            aiSummary: research?.aiSummary,
            confidenceScore: research?.confidenceScore,
          });
        }
      } catch (err) {
        console.error("Failed to fetch visa details:", err);
      } finally {
        setIsLoadingVisa(false);
      }
    }

    fetchVisaDetails();
  }, [visaCode]);

  // Build page title based on context
  const pageTitle = visaContext
    ? `Ask About ${visaContext.name}`
    : "AI Chat Assistant";

  const pageSubtitle = visaContext
    ? `Get answers about the ${visaContext.name} for ${visaContext.country}`
    : "Ask questions about visa requirements, timelines, and processes";

  if (isLoadingVisa) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading visa information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">{pageSubtitle}</p>
      </div>

      <ChatInterface userContext={userContext} visaContext={visaContext} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
