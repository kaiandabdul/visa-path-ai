"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  ArrowRightIcon,
  AlertCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming" | "blocked";
  estimatedDays: number;
  startDay: number;
  requirements: string[];
}

interface PathwayData {
  visaType: {
    name: string;
    country: string;
    processingTimeAvg: number;
    processingTimeMin: number;
    processingTimeMax: number;
  };
  estimatedProcessingTime: number;
}

const generateTimeline = (processingTime: number): TimelineStep[] => {
  return [
    {
      id: "1",
      title: "Profile Assessment",
      description: "AI analyzes your profile and identifies best visa options",
      status: "completed",
      estimatedDays: 1,
      startDay: 0,
      requirements: ["Complete intake form", "Provide accurate information"],
    },
    {
      id: "2",
      title: "Document Collection",
      description: "Gather and upload required documents for verification",
      status: "current",
      estimatedDays: 14,
      startDay: 1,
      requirements: [
        "Passport",
        "Educational certificates",
        "Work experience letters",
      ],
    },
    {
      id: "3",
      title: "Application Preparation",
      description: "Prepare visa application forms and supporting documents",
      status: "upcoming",
      estimatedDays: 7,
      startDay: 15,
      requirements: ["All documents verified", "Application forms completed"],
    },
    {
      id: "4",
      title: "Application Submission",
      description: "Submit your visa application to the relevant authority",
      status: "upcoming",
      estimatedDays: 1,
      startDay: 22,
      requirements: ["Application fee paid", "All documents ready"],
    },
    {
      id: "5",
      title: "Processing Period",
      description:
        "Your application is being reviewed by immigration authorities",
      status: "upcoming",
      estimatedDays: processingTime - 30,
      startDay: 23,
      requirements: ["Wait for decision", "Respond to any queries"],
    },
    {
      id: "6",
      title: "Decision & Visa Issuance",
      description: "Receive your visa decision and collect your visa",
      status: "upcoming",
      estimatedDays: 7,
      startDay: processingTime - 7,
      requirements: ["Approval notification", "Collect visa/residence permit"],
    },
  ];
};

export default function TimelinePage() {
  const [pathway, setPathway] = useState<PathwayData | null>(null);
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      // Generate mock pathway data
      const mockPathway: PathwayData = {
        visaType: {
          name: "EU Blue Card",
          country: "DE",
          processingTimeAvg: 60,
          processingTimeMin: 30,
          processingTimeMax: 90,
        },
        estimatedProcessingTime: 60,
      };
      setPathway(mockPathway);
      setTimeline(generateTimeline(mockPathway.estimatedProcessingTime));
    }
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
        return "bg-blue-500 animate-pulse";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        );
      case "current":
        return <Badge variant="default">In Progress</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  const completedSteps = timeline.filter(
    (s) => s.status === "completed"
  ).length;
  const progress = (completedSteps / timeline.length) * 100;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading timeline...</p>
      </div>
    );
  }

  if (!pathway) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarIcon className="mb-6 h-16 w-16 text-muted-foreground opacity-50" />
        <h2 className="mb-2 text-xl font-semibold">No Timeline Available</h2>
        <p className="mb-6 text-muted-foreground">
          Complete your intake form to see your personalized visa timeline.
        </p>
        <Link href="/dashboard/intake">
          <Button>Start Intake Form</Button>
        </Link>
      </div>
    );
  }

  const country = TARGET_COUNTRIES.find(
    (c) => c.code === pathway.visaType.country
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visa Timeline</h1>
          <p className="text-muted-foreground">
            Track your visa application progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-base py-1 px-3">
            {country?.flag} {pathway.visaType.name}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Overall Progress
              </p>
              <div className="flex items-center gap-4">
                <Progress value={progress} className="flex-1 h-3" />
                <span className="font-bold text-lg">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Estimated Completion
              </p>
              <p className="font-bold text-lg flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-primary" />
                {pathway.estimatedProcessingTime} days
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Step</p>
              <p className="font-bold text-lg">
                {timeline.find((s) => s.status === "current")?.title ||
                  "Complete"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
          <CardDescription>
            Processing time: {pathway.visaType.processingTimeMin}-
            {pathway.visaType.processingTimeMax} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            {/* Steps */}
            <div className="space-y-8">
              {timeline.map((step, index) => (
                <div key={step.id} className="relative pl-12">
                  {/* Step indicator */}
                  <div
                    className={cn(
                      "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                      getStatusColor(step.status)
                    )}
                  >
                    {step.status === "completed" ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : step.status === "blocked" ? (
                      <AlertCircleIcon className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step content */}
                  <div
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      step.status === "current" &&
                        "border-primary bg-primary/5",
                      step.status === "completed" && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      {getStatusBadge(step.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Day {step.startDay} -{" "}
                        {step.startDay + step.estimatedDays}
                      </span>
                      <span>•</span>
                      <span>{step.estimatedDays} days</span>
                    </div>

                    {step.status === "current" && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          Required Actions:
                        </p>
                        <ul className="space-y-1">
                          {step.requirements.map((req, i) => (
                            <li
                              key={i}
                              className="text-sm flex items-center gap-2"
                            >
                              <FileTextIcon className="h-4 w-4 text-primary" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <Link href="/dashboard/documents">
                          <Button size="sm" className="mt-3">
                            Upload Documents
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/documents">
          <Card className="cursor-pointer transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <FileTextIcon className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Continue with document collection
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/chat">
          <Card className="cursor-pointer transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <CalendarIcon className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Get Timeline Help</h3>
                <p className="text-sm text-muted-foreground">
                  Ask AI about next steps
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
