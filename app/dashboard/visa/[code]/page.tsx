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
  GraduationCapIcon,
  LanguagesIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";

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
  salaryThreshold: number | null;
  educationRequired: string | null;
  languageRequirement: string | null;
  requirements: Array<{ name: string; priority: string }>;
}

export default function VisaDetailPage() {
  const params = useParams();
  const visaCode = params.code as string;
  const [visa, setVisa] = useState<VisaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVisa() {
      try {
        const response = await fetch(`/api/visa-types/${visaCode}`);
        if (!response.ok) throw new Error("Visa type not found");
        const data = await response.json();
        if (data.success) {
          setVisa(data.data);
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
      fetchVisa();
    }
  }, [visaCode]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading visa details...</p>
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
  const totalCost = visa.applicationFee + (visa.legalFee || 0);

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
            <p className="text-3xl font-bold">{visa.processingTimeAvg}</p>
            <p className="text-sm text-muted-foreground">
              days avg ({visa.processingTimeMin}-{visa.processingTimeMax})
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
              {totalCost.toLocaleString()} {visa.currency}
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

      {/* Tabs */}
      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visa Requirements</CardTitle>
              <CardDescription>
                What you need to apply for {visa.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visa.requirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
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
                    {visa.applicationFee.toLocaleString()} {visa.currency}
                  </span>
                </div>
                {visa.legalFee && (
                  <div className="flex justify-between items-center border-b pb-3">
                    <span>Legal Fees (estimated)</span>
                    <span className="font-semibold">
                      {visa.legalFee.toLocaleString()} {visa.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total Estimated</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalCost.toLocaleString()} {visa.currency}
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
                    Day {visa.processingTimeMin} - {visa.processingTimeMax}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 w-4 h-4 rounded-full bg-green-500" />
                  <p className="font-semibold">Decision Expected</p>
                  <p className="text-sm text-muted-foreground">
                    ~Day {visa.processingTimeAvg}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {visa.salaryThreshold && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <DollarSignIcon className="h-4 w-4" />
                    Minimum Salary
                  </div>
                  <p className="text-2xl font-bold">
                    {visa.salaryThreshold.toLocaleString()} {visa.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">per year</p>
                </CardContent>
              </Card>
            )}

            {visa.educationRequired && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <GraduationCapIcon className="h-4 w-4" />
                    Education Required
                  </div>
                  <p className="text-2xl font-bold capitalize">
                    {visa.educationRequired}
                  </p>
                  <p className="text-sm text-muted-foreground">minimum level</p>
                </CardContent>
              </Card>
            )}

            {visa.languageRequirement &&
              visa.languageRequirement !== "none" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <LanguagesIcon className="h-4 w-4" />
                      Language Level
                    </div>
                    <p className="text-2xl font-bold capitalize">
                      {visa.languageRequirement}
                    </p>
                    <p className="text-sm text-muted-foreground">proficiency</p>
                  </CardContent>
                </Card>
              )}
          </div>

          {!visa.salaryThreshold &&
            !visa.educationRequired &&
            visa.languageRequirement === "none" && (
              <Card>
                <CardContent className="py-8 text-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">Flexible Requirements</p>
                  <p className="text-muted-foreground">
                    This visa has no strict salary, education, or language
                    requirements.
                  </p>
                </CardContent>
              </Card>
            )}
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
            Ask AI About This Visa
          </Button>
        </Link>
      </div>
    </div>
  );
}
