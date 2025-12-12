import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatProcessingTime,
  formatPercentage,
  getScoreColor,
} from "@/lib/utils/formatters";
import type { VisaPathway } from "@/types";

interface PathwayCardProps {
  pathway: VisaPathway;
  rank?: number;
}

export function PathwayCard({ pathway, rank }: PathwayCardProps) {
  const primaryVisa = pathway.visaTypes[0];

  return (
    <Card className="relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      {/* Rank badge */}
      {rank && (
        <div className="absolute right-4 top-4">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
              rank === 1
                ? "bg-yellow-500 text-white"
                : rank === 2
                ? "bg-gray-400 text-white"
                : "bg-amber-700 text-white"
            )}
          >
            {rank}
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
            {primaryVisa?.country === "DE"
              ? "🇩🇪"
              : primaryVisa?.country === "NL"
              ? "🇳🇱"
              : primaryVisa?.country === "UK"
              ? "🇬🇧"
              : primaryVisa?.country === "US"
              ? "🇺🇸"
              : primaryVisa?.country === "CA"
              ? "🇨🇦"
              : "🌍"}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {primaryVisa?.name || "Visa Pathway"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {primaryVisa?.country || "Multiple Countries"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Eligibility Score</p>
            <p
              className={cn(
                "text-2xl font-bold",
                getScoreColor(pathway.eligibilityScore)
              )}
            >
              {formatPercentage(pathway.eligibilityScore)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p
              className={cn(
                "text-2xl font-bold",
                getScoreColor(pathway.successProbability)
              )}
            >
              {formatPercentage(pathway.successProbability)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing Time</span>
            <span className="font-medium">
              {formatProcessingTime(pathway.estimatedProcessingTime)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-medium">
              {formatCurrency(pathway.totalCost)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="secondary">{primaryVisa?.category || "work"}</Badge>
          </div>
        </div>

        {/* Reasoning */}
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            AI Analysis
          </p>
          <p className="text-sm line-clamp-3">{pathway.reasoning}</p>
        </div>

        {/* Next Steps */}
        {pathway.nextSteps.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Next Steps
            </p>
            <ul className="space-y-1">
              {pathway.nextSteps.slice(0, 2).map((step, index) => (
                <li
                  key={`step-${index}`}
                  className="flex items-start gap-2 text-sm"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Link href={`/dashboard/results/${pathway.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Link href="/dashboard/chat" className="flex-1">
          <Button className="w-full">Ask AI</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
