"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  PlusIcon,
  CalendarIcon,
  StarIcon,
  ArchiveIcon,
  TrendingUpIcon,
  GlobeIcon,
  TrashIcon,
  RefreshCwIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_COUNTRIES } from "@/lib/utils/constants";
import { formatDistanceToNow } from "date-fns";

interface AnalysisSession {
  id: string;
  status: string;
  title: string | null;
  targetCountries: string[];
  pathwaysCount: number;
  topPathwayCode: string | null;
  topPathwayScore: number | null;
  overallAssessment: string | null;
  createdAt: string;
}

export default function ResultsHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AnalysisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "starred" | "archived"
  >("all");
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get userId from localStorage for now (will be replaced with auth)
      const storedUserId = localStorage.getItem("visapath_user_id");
      const params = new URLSearchParams();
      if (storedUserId) params.append("userId", storedUserId);
      if (filter !== "all") params.append("status", filter);

      const response = await fetch(`/api/analysis-sessions?${params}`);
      const data = await response.json();

      if (data.success) {
        setSessions(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleUpdateStatus = async (
    sessionId: string,
    newStatus: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await fetch(`/api/analysis-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchSessions();
    } catch (err) {
      console.error("Error updating session:", err);
    }
  };

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await fetch(`/api/analysis-sessions/${sessionId}`, {
        method: "DELETE",
      });
      fetchSessions();
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const getCountryFlags = (countryCodes: string[]) => {
    return countryCodes
      .map((code) => {
        const country = TARGET_COUNTRIES.find((c) => c.code === code);
        return country?.flag || "🌍";
      })
      .join(" ");
  };

  const getCountryNames = (countryCodes: string[]) => {
    return countryCodes
      .map((code) => {
        const country = TARGET_COUNTRIES.find((c) => c.code === code);
        return country?.name || code;
      })
      .join(", ");
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading your analyses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Visa Analyses</h1>
          <p className="text-muted-foreground">
            View and manage your saved eligibility analyses
          </p>
        </div>
        <Link href="/dashboard/intake">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {(
          [
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "starred", label: "Starred" },
            { value: "archived", label: "Archived" },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.value}
            variant={filter === tab.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(tab.value)}
          >
            {tab.value === "starred" && <StarIcon className="mr-1 h-3 w-3" />}
            {tab.value === "archived" && (
              <ArchiveIcon className="mr-1 h-3 w-3" />
            )}
            {tab.label}
          </Button>
        ))}
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={fetchSessions}>
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-center">
          {error}
        </div>
      )}

      {/* Sessions Grid */}
      {sessions.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <GlobeIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your visa journey by completing the intake form
            </p>
            <Link href="/dashboard/intake">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Start New Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                session.status === "archived" && "opacity-60"
              )}
              onClick={() => router.push(`/dashboard/results/${session.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getCountryFlags(session.targetCountries)}
                    </span>
                    {session.status === "starred" && (
                      <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) =>
                        handleUpdateStatus(
                          session.id,
                          session.status === "starred" ? "active" : "starred",
                          e
                        )
                      }
                    >
                      <StarIcon
                        className={cn(
                          "h-4 w-4",
                          session.status === "starred" &&
                            "fill-yellow-400 text-yellow-400"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) =>
                        handleUpdateStatus(
                          session.id,
                          session.status === "archived" ? "active" : "archived",
                          e
                        )
                      }
                    >
                      <ArchiveIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(session.id, e)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">
                  {session.title || getCountryNames(session.targetCountries)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Top Pathway */}
                  {session.topPathwayCode && session.topPathwayScore && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUpIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {session.topPathwayCode.replace(/_/g, " ")}
                        </span>
                      </div>
                      <Badge
                        variant={
                          session.topPathwayScore >= 80
                            ? "default"
                            : session.topPathwayScore >= 60
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          session.topPathwayScore >= 80
                            ? "bg-green-500/10 text-green-600 border-green-200"
                            : ""
                        }
                      >
                        {session.topPathwayScore}%
                      </Badge>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{session.pathwaysCount} pathways found</span>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDistanceToNow(new Date(session.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    variant={
                      session.status === "active"
                        ? "default"
                        : session.status === "starred"
                        ? "secondary"
                        : "outline"
                    }
                    className="mt-2"
                  >
                    {session.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {sessions.length > 0 && (
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-2xl font-bold">{sessions.length}</p>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sessions.filter((s) => s.status === "starred").length}
                </p>
                <p className="text-sm text-muted-foreground">Starred</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.pathwaysCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Pathways</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
