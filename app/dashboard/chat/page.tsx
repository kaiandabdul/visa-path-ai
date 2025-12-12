"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import type { IntakeFormData } from "@/types";

export default function ChatPage() {
  const [userContext, setUserContext] = useState<IntakeFormData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      setUserContext(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about visa requirements, timelines, and processes
        </p>
      </div>

      <ChatInterface userContext={userContext} />
    </div>
  );
}
