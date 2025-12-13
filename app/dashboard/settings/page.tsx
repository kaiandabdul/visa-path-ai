"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { SunIcon, MoonIcon, MonitorIcon, CheckCircleIcon } from "lucide-react";
import type { IntakeFormData } from "@/types";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<IntakeFormData | null>(null);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: false,
    processing: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all your data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("userProfile");
      setProfile(null);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: MonitorIcon },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {saved && (
        <Alert className="bg-primary/5 border-2 border-primary/20 rounded-2xl">
          <CheckCircleIcon className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-semibold">Settings saved</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your settings have been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Appearance */}
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-semibold">Appearance</CardTitle>
          <CardDescription>
            Customize how VisaPath AI looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-3 block text-sm font-medium">Theme</Label>
            <div className="flex gap-3">
              {themeOptions.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all duration-200",
                      theme === t.value
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-semibold">Profile Summary</CardTitle>
          <CardDescription>
            Your current profile information used for visa analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm text-muted-foreground">
                  Profession
                </span>
                <span className="text-sm font-semibold">
                  {profile.profession}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm text-muted-foreground">
                  Experience
                </span>
                <span className="text-sm font-semibold">
                  {profile.yearsExperience} years
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm text-muted-foreground">Education</span>
                <span className="text-sm font-semibold">{profile.education}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm text-muted-foreground">
                  Target Countries
                </span>
                <div className="flex gap-1">
                  {profile.targetCountries.map((c) => (
                    <Badge key={c} variant="secondary" className="rounded-full px-2.5">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/30 text-center">
              No profile data yet. Complete the intake form to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-semibold">Notifications</CardTitle>
          <CardDescription>
            Manage how you receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="space-y-0.5">
              <Label className="font-medium">Email Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive visa pathway updates via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="space-y-0.5">
              <Label className="font-medium">Processing Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when processing times change
              </p>
            </div>
            <Switch
              checked={notifications.processing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, processing: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-destructive/30 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-destructive font-semibold">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5">
            <div>
              <p className="font-semibold">Clear All Data</p>
              <p className="text-sm text-muted-foreground">
                Remove all your profile data and analysis history
              </p>
            </div>
            <Button variant="destructive" onClick={handleClearData} className="rounded-xl">
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="rounded-xl shadow-md shadow-primary/20 px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
