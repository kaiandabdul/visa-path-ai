"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  ClipboardListIcon,
  BarChartIcon,
  MessageSquareIcon,
  FileTextIcon,
  ArrowRightIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";

interface DashboardStats {
  profileCompletion: number;
  pathwaysAnalyzed: number;
  documentsUploaded: number;
  chatSessions: number;
  hasProfile: boolean;
  topPathway?: {
    visaName: string;
    country: string;
    score: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      // Load from localStorage
      const userProfile = localStorage.getItem("userProfile");
      const userDocuments = localStorage.getItem("userDocuments");

      const profileData = userProfile ? JSON.parse(userProfile) : null;
      const docsData = userDocuments ? JSON.parse(userDocuments) : [];

      // Calculate profile completion
      let completion = 0;
      if (profileData) {
        if (profileData.currentCountry) completion += 15;
        if (profileData.targetCountries?.length > 0) completion += 15;
        if (profileData.profession) completion += 20;
        if (profileData.yearsExperience) completion += 15;
        if (profileData.education) completion += 15;
        if (profileData.languages?.length > 0) completion += 10;
        if (profileData.email) completion += 10;
      }

      setStats({
        profileCompletion: completion,
        pathwaysAnalyzed: profileData ? 3 : 0, // Mock
        documentsUploaded: docsData.length,
        chatSessions: 0, // Would fetch from API
        hasProfile: !!profileData,
        topPathway: profileData
          ? {
              visaName: "EU Blue Card",
              country: "DE",
              score: 85,
            }
          : undefined,
      });

      setIsLoading(false);
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const country = stats?.topPathway
    ? TARGET_COUNTRIES.find((c) => c.code === stats.topPathway?.country)
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {stats?.hasProfile ? "Welcome back!" : "Welcome to VisaPath AI"}
          </h1>
          <p className="text-muted-foreground">
            {stats?.hasProfile
              ? "Track your visa journey and get personalized recommendations."
              : "Let's get started on your visa journey."}
          </p>
        </div>
        <Link
          href={stats?.hasProfile ? "/dashboard/results" : "/dashboard/intake"}
        >
          <Button>
            {stats?.hasProfile ? "View Results" : "Start Assessment"}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Top Pathway Highlight */}
      {stats?.topPathway && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Top Recommendation
                </Badge>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {country?.flag} {stats.topPathway.visaName}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.topPathway.score}% eligibility match
                </p>
              </div>
              <Link href="/dashboard/results">
                <Button>
                  View Details
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.profileCompletion || 0}%
            </div>
            <Progress value={stats?.profileCompletion || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pathways Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pathwaysAnalyzed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pathwaysAnalyzed
                ? "AI-powered analysis"
                : "Complete intake to see pathways"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents Uploaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.documentsUploaded || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.documentsUploaded
                ? "Ready for review"
                : "Upload documents for analysis"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chat Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.chatSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ask AI about your visa options
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Intake Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardListIcon className="h-6 w-6" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {stats?.hasProfile ? "Update Profile" : "Complete Your Profile"}
              </h3>
              {!stats?.hasProfile && (
                <Badge variant="destructive">Required</Badge>
              )}
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {stats?.hasProfile
                ? "Update your information to get fresh recommendations."
                : "Tell us about yourself so we can analyze your visa options."}
            </p>
            <Link href="/dashboard/intake">
              <Button variant="outline" className="w-full">
                {stats?.hasProfile ? "Update Profile" : "Start Intake Form"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">View Timeline</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Track your application progress and see upcoming milestones.
            </p>
            <Link href="/dashboard/timeline">
              <Button variant="outline" className="w-full">
                View Timeline
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <FileTextIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Upload Documents</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Upload your documents for AI-powered verification.
            </p>
            <Link href="/dashboard/documents">
              <Button variant="outline" className="w-full">
                Manage Documents
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <BarChartIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">View Your Results</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              See your recommended visa pathways and eligibility scores.
            </p>
            <Link href="/dashboard/results">
              <Button variant="outline" className="w-full">
                View Results
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Chat Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <MessageSquareIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Ask AI Assistant</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get instant answers to your visa questions from our AI.
            </p>
            <Link href="/dashboard/chat">
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
              <UserIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Your Profile</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              View and manage your immigration profile details.
            </p>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.hasProfile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Profile completed</span>
                <span className="text-muted-foreground ml-auto">Today</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>AI analysis completed - 3 pathways recommended</span>
                <span className="text-muted-foreground ml-auto">Today</span>
              </div>
              {(stats?.documentsUploaded || 0) > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>{stats.documentsUploaded} document(s) uploaded</span>
                  <span className="text-muted-foreground ml-auto">Today</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <CalendarIcon className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-sm">No activity yet</p>
              <p className="text-xs">
                Complete your intake form to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
