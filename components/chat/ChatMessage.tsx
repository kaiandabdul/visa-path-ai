import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      {/* Avatar */}
      {!isUser && (
        <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-blue-600">
          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-xs font-bold">
            V
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.content.split("\n").map((line: string, i: number) => (
            <p
              key={`line-${message.id}-${i}`}
              className={cn("m-0", i > 0 && "mt-2")}
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
