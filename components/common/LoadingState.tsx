import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({
  message = "Loading...",
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullPage ? "min-h-screen" : "min-h-[200px]"
      )}
    >
      <Spinner className="size-8" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
