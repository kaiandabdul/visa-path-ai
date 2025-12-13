"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeftIcon,
  CalendarIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  GraduationCapIcon,
  LanguagesIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  InfoIcon,
  SparklesIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";
import { formatDistanceToNow, format } from "date-fns";

interface VisaType {
  id: string;
  code: string;
  name: string;
  country: string;
  category: string;
  description: string;
  processingTimeMin: number;
  processingTimeMax: number;
  processingTimeAvg: number;
  applicationFee: number;
  legalFee: number | null;
  currency: string;
  successRate: number;
}

interface ResearchData {
  id: string;
  researchedAt: string;
  expiresAt: string;
  isLive: boolean;
  fromCache: boolean;
  confidenceScore: number;
  aiSummary: string | null;
  officialRequirements: Array<{
    name: string;
    description: string;
    priority: string;
    documentNeeded: boolean;
  }>;
  currentFees: {
    applicationFee: number;
    currency: string;
    additionalFees: Array<{ name: string; amount: number; optional: boolean }>;
    totalEstimate: number;
    lastUpdated: string;
  };
  processingTimes: {
    standard: { minDays: number; maxDays: number; avgDays: number };
    expedited?: { available: boolean; days?: number; additionalCost?: number };
  };
  eligibilityCriteria: {
    minimumSalary: number | null;
    salaryCurrency: string | null;
    educationRequired: string | null;
    experienceYears: number | null;
    languageRequirement: string | null;
    ageLimit: number | null;
    additionalCriteria: string[];
  };
  applicationSteps: Array<{
    step: number;
    title: string;
    description: string;
    estimatedDays: number;
    onlineAvailable: boolean;
  }>;
  recentChanges: string[];
  sources: Array<{ title: string; url: string; type: string }>;
}

export default function VisaDetailPage() {
  const params = useParams();
  const visaCode = params.code as string;
  const [visa, setVisa] = useState<VisaType | null>(null);
  const [research, setResearch] = useState<ResearchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVisaResearch() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/ai/research/${visaCode}`);
        const data = await response.json();

        if (data.success) {
          setVisa(data.data.visa);
          setResearch(data.data.research);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load visa details"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (visaCode) {
      fetchVisaResearch();
    }
  }, [visaCode]);

  const handleRefreshResearch = async () => {
    setIsResearching(true);
    try {
      const response = await fetch(`/api/ai/research/${visaCode}`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setResearch(data.data.research);
      }
    } catch (err) {
      console.error("Failed to refresh research:", err);
    } finally {
      setIsResearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading visa details...</p>
        <p className="text-sm text-muted-foreground">
          Researching current requirements...
        </p>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangleIcon className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-xl font-semibold">Visa Type Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          {error || "Unable to load visa details"}
        </p>
        <Link href="/dashboard/results">
          <Button>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
        </Link>
      </div>
    );
  }

  const country = TARGET_COUNTRIES.find((c) => c.code === visa.country);
  const fees = research?.currentFees;
  const processing = research?.processingTimes;

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
            <span className="text-2xl">{country?.flag}</span>
            <h1 className="text-2xl font-bold">{visa.name}</h1>
            <Badge variant="secondary">{visa.category}</Badge>
          </div>
          <p className="text-muted-foreground">{visa.description}</p>
        </div>
      </div>

      {/* Verification Badge */}
      {research && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Verified Information
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-green-100/50 border-green-300 text-green-700"
                    >
                      {research.confidenceScore}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {research.fromCache ? "From cache • " : "Live research • "}
                    Last updated{" "}
                    {formatDistanceToNow(new Date(research.researchedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshResearch}
                disabled={isResearching}
                className="border-green-300 hover:bg-green-100"
              >
                {isResearching ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <RefreshCwIcon className="h-4 w-4 mr-1" />
                )}
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Summary */}
      {research?.aiSummary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <SparklesIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">{research.aiSummary}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircleIcon className="h-4 w-4" />
              Success Rate
            </div>
            <p
              className={cn(
                "text-3xl font-bold",
                visa.successRate >= 80
                  ? "text-green-500"
                  : visa.successRate >= 60
                  ? "text-yellow-500"
                  : "text-red-500"
              )}
            >
              {visa.successRate}%
            </p>
            <Progress value={visa.successRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ClockIcon className="h-4 w-4" />
              Processing Time
            </div>
            <p className="text-3xl font-bold">
              {processing?.standard.avgDays || visa.processingTimeAvg}
            </p>
            <p className="text-sm text-muted-foreground">
              days avg ({processing?.standard.minDays || visa.processingTimeMin}
              -{processing?.standard.maxDays || visa.processingTimeMax})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSignIcon className="h-4 w-4" />
              Total Cost
            </div>
            <p className="text-3xl font-bold">
              {fees
                ? `${fees.totalEstimate.toLocaleString()} ${fees.currency}`
                : `${visa.applicationFee.toLocaleString()} ${visa.currency}`}
            </p>
            <p className="text-sm text-muted-foreground">estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              Country
            </div>
            <p className="text-3xl font-bold">{country?.flag}</p>
            <p className="text-sm text-muted-foreground">{country?.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes Alert */}
      {research?.recentChanges && research.recentChanges.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
              Recent Policy Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {research.recentChanges.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600 mt-1">•</span>
                  {change}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="process">Application Process</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Official Requirements</CardTitle>
              <CardDescription>
                Verified requirements for {visa.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {research?.officialRequirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                          req.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : req.priority === "important"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {req.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.documentNeeded && (
                        <Badge variant="outline">
                          <FileTextIcon className="h-3 w-3 mr-1" />
                          Document needed
                        </Badge>
                      )}
                      <Badge
                        variant={
                          req.priority === "critical"
                            ? "destructive"
                            : req.priority === "important"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {req.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Cost Breakdown</CardTitle>
              {fees?.lastUpdated && (
                <CardDescription>
                  Last verified: {fees.lastUpdated}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span>Application Fee (Official)</span>
                  <span className="font-semibold">
                    {fees?.applicationFee.toLocaleString() ||
                      visa.applicationFee.toLocaleString()}{" "}
                    {fees?.currency || visa.currency}
                  </span>
                </div>
                {fees?.additionalFees.map((fee, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div className="flex items-center gap-2">
                      <span>{fee.name}</span>
                      {fee.optional && (
                        <Badge variant="outline" className="text-xs">
                          Optional
                        </Badge>
                      )}
                    </div>
                    <span className="font-semibold">
                      {fee.amount.toLocaleString()} {fees?.currency}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total Estimated</span>
                  <span className="text-2xl font-bold text-primary">
                    {fees?.totalEstimate.toLocaleString() ||
                      visa.applicationFee.toLocaleString()}{" "}
                    {fees?.currency || visa.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

                {research?.applicationSteps.map((step, i) => (
                  <div key={i} className="relative">
                    <div
                      className={cn(
                        "absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border-2 border-primary"
                      )}
                    >
                      {step.step}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{step.title}</p>
                        {step.onlineAvailable && (
                          <Badge variant="outline" className="text-xs">
                            Online available
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ~{step.estimatedDays} days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {research?.eligibilityCriteria.minimumSalary && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <DollarSignIcon className="h-4 w-4" />
                    Minimum Salary
                  </div>
                  <p className="text-2xl font-bold">
                    {research.eligibilityCriteria.minimumSalary.toLocaleString()}{" "}
                    {research.eligibilityCriteria.salaryCurrency}
                  </p>
                  <p className="text-sm text-muted-foreground">per year</p>
                </CardContent>
              </Card>
            )}

            {research?.eligibilityCriteria.educationRequired && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <GraduationCapIcon className="h-4 w-4" />
                    Education Required
                  </div>
                  <p className="text-2xl font-bold capitalize">
                    {research.eligibilityCriteria.educationRequired}
                  </p>
                  <p className="text-sm text-muted-foreground">minimum level</p>
                </CardContent>
              </Card>
            )}

            {research?.eligibilityCriteria.languageRequirement && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <LanguagesIcon className="h-4 w-4" />
                    Language Level
                  </div>
                  <p className="text-2xl font-bold capitalize">
                    {research.eligibilityCriteria.languageRequirement}
                  </p>
                  <p className="text-sm text-muted-foreground">proficiency</p>
                </CardContent>
              </Card>
            )}

            {research?.eligibilityCriteria.experienceYears && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ClockIcon className="h-4 w-4" />
                    Experience Required
                  </div>
                  <p className="text-2xl font-bold">
                    {research.eligibilityCriteria.experienceYears}+ years
                  </p>
                  <p className="text-sm text-muted-foreground">in your field</p>
                </CardContent>
              </Card>
            )}
          </div>

          {research?.eligibilityCriteria.additionalCriteria &&
            research.eligibilityCriteria.additionalCriteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <InfoIcon className="h-5 w-5" />
                    Additional Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {research.eligibilityCriteria.additionalCriteria.map(
                      (criterion, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          {criterion}
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Official Sources</CardTitle>
              <CardDescription>
                All information verified from these official sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {research?.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          source.type === "government"
                            ? "bg-blue-100 text-blue-600"
                            : source.type === "official"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        <ShieldCheckIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{source.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {source.type}
                        </p>
                      </div>
                    </div>
                    <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard/documents" className="flex-1">
          <Button variant="outline" className="w-full">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
        </Link>
        <Link href={`/dashboard/chat?visa=${visa.code}`} className="flex-1">
          <Button className="w-full">
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Ask AI About This Visa
          </Button>
        </Link>
      </div>
    </div>
  );
}
