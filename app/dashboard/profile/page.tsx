"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  UserIcon,
  MapPinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LanguagesIcon,
  CalendarIcon,
  RefreshCwIcon,
  PlusIcon,
} from "lucide-react";
import { TARGET_COUNTRIES, EDUCATION_LEVELS } from "@/lib/utils/constants";
import Link from "next/link";

interface UserProfile {
  id: string;
  currentCountry: string;
  targetCountries: string[];
  profession: string;
  yearsExperience: number;
  education: string;
  languages: string[];
  salary: number;
  isActive: boolean;
  createdAt: string;
}

interface UserData {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Load from localStorage for now (no auth yet)
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const parsedProfile = JSON.parse(stored);
      setProfile({
        id: "local-profile",
        ...parsedProfile,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      setUser({
        id: "local-user",
        email: parsedProfile.email || "demo@example.com",
        name: null,
        createdAt: new Date().toISOString(),
      });
    }
    setIsLoading(false);
  }, []);

  const getCountryName = (code: string) =>
    TARGET_COUNTRIES.find((c) => c.code === code)?.name || code;

  const getCountryFlag = (code: string) =>
    TARGET_COUNTRIES.find((c) => c.code === code)?.flag || "🌍";

  const getEducationLabel = (value: string) =>
    EDUCATION_LEVELS.find((e) => e.value === value)?.label || value;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <UserIcon className="mb-6 h-16 w-16 text-muted-foreground opacity-50" />
        <h2 className="mb-2 text-xl font-semibold">No Profile Found</h2>
        <p className="mb-6 text-muted-foreground">
          Complete your intake form to create a profile.
        </p>
        <Link href="/dashboard/intake">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Review and manage your immigration profile
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/intake">
            <Button variant="outline">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </Link>
          <Link href="/dashboard/results">
            <Button>View Pathways</Button>
          </Link>
        </div>
      </div>

      {profile.isActive && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Active Profile</AlertTitle>
          <AlertDescription className="text-green-700">
            This is your current active profile used for visa pathway analysis.
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Country</p>
              <p className="text-lg font-medium flex items-center gap-2">
                {getCountryFlag(profile.currentCountry)}
                {getCountryName(profile.currentCountry)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Target Countries
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.targetCountries.map((code) => (
                  <Badge key={code} variant="secondary" className="text-sm">
                    {getCountryFlag(code)} {getCountryName(code)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5 text-primary" />
              Professional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Profession</p>
              <p className="text-lg font-medium">{profile.profession}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{profile.yearsExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Salary</p>
                <p className="font-medium">
                  ${profile.salary.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCapIcon className="h-5 w-5 text-primary" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {getEducationLabel(profile.education)}
            </p>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LanguagesIcon className="h-5 w-5 text-primary" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-sm">
                  {lang}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profile Created</p>
            <p className="font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard/results">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2"
              >
                <span className="text-2xl">📊</span>
                <span>View Analysis Results</span>
              </Button>
            </Link>
            <Link href="/dashboard/documents">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2"
              >
                <span className="text-2xl">📄</span>
                <span>Upload Documents</span>
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2"
              >
                <span className="text-2xl">💬</span>
                <span>Chat with AI</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
