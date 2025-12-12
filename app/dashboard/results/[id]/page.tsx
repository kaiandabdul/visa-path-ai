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
  ArrowLeftIcon,
  CalendarIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";

interface PathwayDetails {
  id: string;
  eligibilityScore: number;
  successProbability: number;
  estimatedProcessingTime: number;
  totalCost: number;
  reasoning: string;
  nextSteps: string[];
  riskFactors: string[];
  status: string;
  createdAt: string;
  visaTypes: Array<{
    visaType: {
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
      salaryThreshold: number | null;
      educationRequired: string | null;
      languageRequirement: string | null;
      requirements: Array<{ name: string; priority: string }>;
    };
  }>;
}

export default function PathwayDetailPage() {
  const params = useParams();
  const pathwayId = params.id as string;
  const [pathway, setPathway] = useState<PathwayDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPathway() {
      try {
        const response = await fetch(`/api/pathways/${pathwayId}`);
        if (!response.ok) throw new Error("Pathway not found");
        const data = await response.json();
        if (data.success) {
          setPathway(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pathway");
      } finally {
        setIsLoading(false);
      }
    }

    if (pathwayId) {
      fetchPathway();
    }
  }, [pathwayId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading pathway details...</p>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangleIcon className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-xl font-semibold">Pathway Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          {error || "Unable to load pathway details"}
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

  const primaryVisa = pathway.visaTypes[0]?.visaType;
  const country = TARGET_COUNTRIES.find((c) => c.code === primaryVisa?.country);

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
            <h1 className="text-2xl font-bold">{primaryVisa?.name}</h1>
            <Badge variant="secondary">{primaryVisa?.category}</Badge>
          </div>
          <p className="text-muted-foreground">{primaryVisa?.description}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircleIcon className="h-4 w-4" />
              Eligibility Score
            </div>
            <p
              className={cn(
                "text-3xl font-bold",
                getScoreColor(pathway.eligibilityScore)
              )}
            >
              {pathway.eligibilityScore}%
            </p>
            <Progress value={pathway.eligibilityScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ClockIcon className="h-4 w-4" />
              Processing Time
            </div>
            <p className="text-3xl font-bold">
              {pathway.estimatedProcessingTime}
            </p>
            <p className="text-sm text-muted-foreground">days estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSignIcon className="h-4 w-4" />
              Total Cost
            </div>
            <p className="text-3xl font-bold">
              ${pathway.totalCost.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              Success Rate
            </div>
            <p
              className={cn(
                "text-3xl font-bold",
                getScoreColor(pathway.successProbability)
              )}
            >
              {pathway.successProbability}%
            </p>
            <Progress value={pathway.successProbability} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{pathway.reasoning}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {pathway.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-5 w-5 text-orange-500" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pathway.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500">⚠️</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visa Requirements</CardTitle>
              <CardDescription>
                Requirements for {primaryVisa?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {primaryVisa?.requirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium",
                          req.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : req.priority === "important"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {i + 1}
                      </div>
                      <span>{req.name}</span>
                    </div>
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
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {primaryVisa?.salaryThreshold && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Minimum Salary
                  </p>
                  <p className="text-2xl font-bold">
                    {primaryVisa.salaryThreshold.toLocaleString()}{" "}
                    {primaryVisa.currency}
                  </p>
                </CardContent>
              </Card>
            )}
            {primaryVisa?.educationRequired && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Education Required
                  </p>
                  <p className="text-2xl font-bold capitalize">
                    {primaryVisa.educationRequired}
                  </p>
                </CardContent>
              </Card>
            )}
            {primaryVisa?.languageRequirement && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Language Level
                  </p>
                  <p className="text-2xl font-bold capitalize">
                    {primaryVisa.languageRequirement}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span>Application Fee</span>
                  <span className="font-semibold">
                    {primaryVisa?.applicationFee.toLocaleString()}{" "}
                    {primaryVisa?.currency}
                  </span>
                </div>
                {primaryVisa?.legalFee && (
                  <div className="flex justify-between items-center border-b pb-3">
                    <span>Legal Fees (estimated)</span>
                    <span className="font-semibold">
                      {primaryVisa.legalFee.toLocaleString()}{" "}
                      {primaryVisa.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total Estimated</span>
                  <span className="text-2xl font-bold text-primary">
                    ${pathway.totalCost.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

                <div className="relative">
                  <div className="absolute -left-5 w-4 h-4 rounded-full bg-primary" />
                  <p className="font-semibold">Start Application</p>
                  <p className="text-sm text-muted-foreground">Day 0</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 w-4 h-4 rounded-full bg-muted border-2 border-primary" />
                  <p className="font-semibold">Submit Documents</p>
                  <p className="text-sm text-muted-foreground">Day 7-14</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 w-4 h-4 rounded-full bg-muted border-2 border-primary" />
                  <p className="font-semibold">Under Review</p>
                  <p className="text-sm text-muted-foreground">
                    Day {primaryVisa?.processingTimeMin} -{" "}
                    {primaryVisa?.processingTimeMax}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 w-4 h-4 rounded-full bg-muted border-2 border-primary" />
                  <p className="font-semibold">Decision Expected</p>
                  <p className="text-sm text-muted-foreground">
                    ~Day {pathway.estimatedProcessingTime}
                  </p>
                </div>
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
        <Link href="/dashboard/chat" className="flex-1">
          <Button className="w-full">
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Ask AI Questions
          </Button>
        </Link>
      </div>
    </div>
  );
}
