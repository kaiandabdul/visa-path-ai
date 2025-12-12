"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { IntakeFormData } from "@/types";
import {
  InfoIcon,
  ArrowRightIcon,
  MessageSquareIcon,
  RefreshCwIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";

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

interface AnalysisResult {
  pathways: PathwayResult[];
  overallAssessment: string;
  topRecommendation: string;
  saved?: {
    userId: string;
    profileId: string;
    pathwayIds: string[];
  };
}

export default function ResultsPage() {
  const [profile, setProfile] = useState<IntakeFormData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPathways, setSelectedPathways] = useState<string[]>([]);

  const analyzeEligibility = useCallback(
    async (profileData: IntakeFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/eligibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userProfile: profileData,
            saveToDatabase: !!profileData.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze eligibility");
        }

        const result = await response.json();

        if (result.success) {
          setAnalysisResult(result.data);
        } else {
          throw new Error(result.error || "Analysis failed");
        }
      } catch (err) {
        console.error("Analysis error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const parsedProfile = JSON.parse(stored) as IntakeFormData;
      setProfile(parsedProfile);
      analyzeEligibility(parsedProfile);
    } else {
      setIsLoading(false);
    }
  }, [analyzeEligibility]);

  const handlePathwaySelect = (code: string) => {
    if (selectedPathways.includes(code)) {
      setSelectedPathways(selectedPathways.filter((c) => c !== code));
    } else if (selectedPathways.length < 3) {
      setSelectedPathways([...selectedPathways, code]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Low";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">
          Analyzing your visa options with AI...
        </p>
        <p className="text-sm text-muted-foreground">
          This may take a few seconds
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={() => profile && analyzeEligibility(profile)}
          className="mt-4"
          variant="outline"
        >
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Retry Analysis
        </Button>
      </div>
    );
  }

  if (!profile || !analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="mb-6 h-16 w-16 text-muted-foreground opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 className="mb-2 text-xl font-semibold">No Results Yet</h2>
        <p className="mb-6 text-muted-foreground">
          Complete your intake form to get personalized visa pathway
          recommendations.
        </p>
        <Link href="/dashboard/intake">
          <Button>Start Intake Form</Button>
        </Link>
      </div>
    );
  }

  const pathways = analysisResult.pathways;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Visa Pathways</h1>
          <p className="text-muted-foreground">
            AI-powered analysis based on your profile
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showComparison ? "default" : "outline"}
            onClick={() => setShowComparison(!showComparison)}
            disabled={pathways.length < 2}
          >
            {showComparison ? "Hide" : "Compare"} Pathways
          </Button>
          <Link href="/dashboard/chat">
            <Button variant="outline">
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              Ask AI Questions
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Alert */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Analysis Complete</AlertTitle>
        <AlertDescription>{analysisResult.overallAssessment}</AlertDescription>
      </Alert>

      {/* Top Recommendation Highlight */}
      {pathways.length > 0 && pathways[0].visaType && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">Top Recommendation</Badge>
              <Badge variant="outline">
                {
                  TARGET_COUNTRIES.find(
                    (c) => c.code === pathways[0].visaType?.country
                  )?.flag
                }{" "}
                {pathways[0].visaType.country}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold">
                  {pathways[0].visaType.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {pathways[0].reasoning}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Eligibility Score
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      getScoreColor(pathways[0].eligibilityScore)
                    )}
                  >
                    {pathways[0].eligibilityScore}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Success Probability
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      getScoreColor(pathways[0].successProbability)
                    )}
                  >
                    {pathways[0].successProbability}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Processing Time
                  </p>
                  <p className="text-lg font-semibold">
                    {pathways[0].estimatedProcessingTime} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Est. Total Cost
                  </p>
                  <p className="text-lg font-semibold">
                    ${pathways[0].totalCostEstimate.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison View */}
      {showComparison && pathways.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Compare Pathways</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Select pathways to compare:
              </p>
              <div className="flex flex-wrap gap-2">
                {pathways.map((p) => (
                  <Button
                    key={p.visaTypeCode}
                    variant={
                      selectedPathways.includes(p.visaTypeCode)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handlePathwaySelect(p.visaTypeCode)}
                  >
                    {p.visaType?.name || p.visaTypeCode}
                  </Button>
                ))}
              </div>
            </div>

            {selectedPathways.length >= 2 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left text-sm font-medium">
                        Criteria
                      </th>
                      {selectedPathways.map((code) => {
                        const p = pathways.find(
                          (pw) => pw.visaTypeCode === code
                        );
                        return (
                          <th
                            key={code}
                            className="py-2 text-left text-sm font-medium"
                          >
                            {p?.visaType?.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-sm text-muted-foreground">
                        Eligibility
                      </td>
                      {selectedPathways.map((code) => {
                        const p = pathways.find(
                          (pw) => pw.visaTypeCode === code
                        );
                        return (
                          <td
                            key={code}
                            className={cn(
                              "py-2 font-semibold",
                              getScoreColor(p?.eligibilityScore || 0)
                            )}
                          >
                            {p?.eligibilityScore}%
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-sm text-muted-foreground">
                        Success Rate
                      </td>
                      {selectedPathways.map((code) => {
                        const p = pathways.find(
                          (pw) => pw.visaTypeCode === code
                        );
                        return (
                          <td key={code} className="py-2">
                            {p?.successProbability}%
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-sm text-muted-foreground">
                        Processing Time
                      </td>
                      {selectedPathways.map((code) => {
                        const p = pathways.find(
                          (pw) => pw.visaTypeCode === code
                        );
                        return (
                          <td key={code} className="py-2">
                            {p?.estimatedProcessingTime} days
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-muted-foreground">
                        Total Cost
                      </td>
                      {selectedPathways.map((code) => {
                        const p = pathways.find(
                          (pw) => pw.visaTypeCode === code
                        );
                        return (
                          <td key={code} className="py-2">
                            ${p?.totalCostEstimate.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pathway Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pathways.map((pathway, index) => (
          <Card
            key={pathway.visaTypeCode}
            className={cn(
              "transition-all hover:shadow-md",
              index === 0 && "ring-2 ring-primary/20"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  #{index + 1} Recommended
                </Badge>
                <Badge variant="outline">
                  {
                    TARGET_COUNTRIES.find(
                      (c) => c.code === pathway.visaType?.country
                    )?.flag
                  }{" "}
                  {pathway.visaType?.country}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">
                {pathway.visaType?.name || pathway.visaTypeCode}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Eligibility Score */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Eligibility</span>
                  <span
                    className={cn(
                      "font-medium",
                      getScoreColor(pathway.eligibilityScore)
                    )}
                  >
                    {pathway.eligibilityScore}% -{" "}
                    {getScoreLabel(pathway.eligibilityScore)}
                  </span>
                </div>
                <Progress value={pathway.eligibilityScore} className="h-2" />
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Processing</p>
                  <p className="font-medium">
                    {pathway.estimatedProcessingTime} days
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost</p>
                  <p className="font-medium">
                    ${pathway.totalCostEstimate.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Next Steps Preview */}
              <div>
                <p className="text-sm font-medium mb-2">Next Steps:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pathway.nextSteps.slice(0, 2).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors */}
              {pathway.riskFactors.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pathway.riskFactors.slice(0, 2).map((risk, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs text-orange-500 border-orange-200"
                    >
                      ⚠️ {risk}
                    </Badge>
                  ))}
                </div>
              )}

              <Link href={`/dashboard/visa/${pathway.visaTypeCode}`}>
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View Details
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <MessageSquareIcon className="h-12 w-12 text-primary opacity-70" />
          <div>
            <h3 className="text-lg font-semibold">Have Questions?</h3>
            <p className="text-sm text-muted-foreground">
              Our AI assistant can help you understand your options better.
            </p>
          </div>
          <Link href="/dashboard/chat">
            <Button>Chat with AI</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
