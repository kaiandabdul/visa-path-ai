"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
  ArchiveIcon,
  MessageSquareIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";
import { formatDistanceToNow, format } from "date-fns";

interface PathwayResult {
  visaTypeCode: string;
  eligibilityScore: number;
  successProbability: number;
  estimatedProcessingTime: number;
  totalCostEstimate: number;
  reasoning: string;
  nextSteps: string[];
  riskFactors: string[];
  recommendationRank: number;
  visaType: {
    id: string;
    code: string;
    name: string;
    country: string;
    category: string;
    processingTimeAvg: number;
    applicationFee: number;
    legalFee: number | null;
    currency: string;
    successRate: number;
  } | null;
}

interface SessionDetail {
  id: string;
  status: string;
  title: string | null;
  targetCountries: string[];
  pathwaysCount: number;
  topPathwayCode: string | null;
  topPathwayScore: number | null;
  overallAssessment: string | null;
  topRecommendation: string | null;
  profileSnapshot: Record<string, unknown>;
  pathways: PathwayResult[];
  createdAt: string;
  updatedAt: string;
}

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPathways, setSelectedPathways] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/analysis-sessions/${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setSession(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setIsLoading(false);
      }
    }

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/analysis-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setSession((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      console.error("Error updating session:", err);
    }
  };

  const togglePathwaySelection = (code: string) => {
    setSelectedPathways((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 3
        ? [...prev, code]
        : prev
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading analysis results...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangleIcon className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-xl font-semibold">Analysis Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          {error || "Unable to load this analysis"}
        </p>
        <Link href="/dashboard/results">
          <Button>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  const getCountryFlag = (code: string) => {
    const country = TARGET_COUNTRIES.find((c) => c.code === code);
    return country?.flag || "🌍";
  };

  const sortedPathways = [...(session.pathways || [])].sort(
    (a, b) => b.eligibilityScore - a.eligibilityScore
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/results">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">
              {session.title ||
                session.targetCountries
                  .map(
                    (c) =>
                      TARGET_COUNTRIES.find((tc) => tc.code === c)?.name || c
                  )
                  .join(", ")}
            </h1>
            <Badge>{session.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(session.createdAt), "MMMM d, yyyy")}
            </div>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(session.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleUpdateStatus(
                session.status === "starred" ? "active" : "starred"
              )
            }
          >
            <StarIcon
              className={cn(
                "h-4 w-4 mr-1",
                session.status === "starred" &&
                  "fill-yellow-400 text-yellow-400"
              )}
            />
            {session.status === "starred" ? "Unstar" : "Star"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleUpdateStatus(
                session.status === "archived" ? "active" : "archived"
              )
            }
          >
            <ArchiveIcon className="h-4 w-4 mr-1" />
            {session.status === "archived" ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      {/* Overall Assessment */}
      {session.overallAssessment && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="py-4">
            <p className="text-sm leading-relaxed">
              {session.overallAssessment}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top Recommendation */}
      {session.topRecommendation && (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Top Recommendation
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {session.topRecommendation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compare Button */}
      {selectedPathways.length >= 2 && (
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedPathways.length} pathways selected
          </span>
          <Button size="sm" onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? "Hide Comparison" : "Compare Selected"}
          </Button>
        </div>
      )}

      {/* Pathways Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {sortedPathways.map((pathway, index) => (
          <Card
            key={pathway.visaTypeCode}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedPathways.includes(pathway.visaTypeCode) &&
                "ring-2 ring-primary",
              index === 0 && "md:col-span-2 border-primary"
            )}
            onClick={() => togglePathwaySelection(pathway.visaTypeCode)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getCountryFlag(pathway.visaType?.country || "")}
                  </span>
                  <div>
                    <CardTitle className="text-lg">
                      {pathway.visaType?.name || pathway.visaTypeCode}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pathway.visaType?.category} visa
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-3xl font-bold",
                      pathway.eligibilityScore >= 80
                        ? "text-green-500"
                        : pathway.eligibilityScore >= 60
                        ? "text-yellow-500"
                        : "text-red-500"
                    )}
                  >
                    {pathway.eligibilityScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <Progress value={pathway.eligibilityScore} className="h-2" />

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-muted/50 rounded p-2">
                  <ClockIcon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-medium">
                    {pathway.estimatedProcessingTime}d
                  </p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <DollarSignIcon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-medium">
                    ${pathway.totalCostEstimate?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">Est. Cost</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <CheckCircleIcon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-medium">{pathway.successProbability}%</p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
              </div>

              {/* Reasoning */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {pathway.reasoning}
              </p>

              {/* Risk Factors */}
              {pathway.riskFactors?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pathway.riskFactors.slice(0, 2).map((risk, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <AlertTriangleIcon className="h-3 w-3 mr-1 text-yellow-500" />
                      {risk}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/dashboard/visa/${pathway.visaTypeCode}`}
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/chat?visa=${pathway.visaTypeCode}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="secondary" size="sm">
                    <MessageSquareIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Back to History */}
      <div className="flex justify-center pt-4">
        <Link href="/dashboard/results">
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Analysis History
          </Button>
        </Link>
      </div>
    </div>
  );
}
