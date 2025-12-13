import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SparklesIcon, UserIcon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <SparklesIcon className="h-4 w-4" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-foreground text-background rounded-tr-md"
            : "bg-card border border-border/50 text-foreground rounded-tl-md"
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.content.split("\n").map((line: string, i: number) => (
            <p
              key={`line-${message.id}-${i}`}
              className={cn("m-0 leading-relaxed", i > 0 && "mt-2")}
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <UserIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
