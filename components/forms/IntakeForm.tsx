"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  TARGET_COUNTRIES,
  LANGUAGES,
  EDUCATION_LEVELS,
  PROFESSIONS,
} from "@/lib/utils/constants";
import { EducationLevel, type IntakeFormData } from "@/types";
import { cn } from "@/lib/utils";

interface IntakeFormProps {
  onSubmit?: (data: IntakeFormData) => void;
}

const steps = [
  {
    id: 1,
    title: "Location",
    description: "Where are you now and where do you want to go?",
  },
  {
    id: 2,
    title: "Professional",
    description: "Tell us about your work experience",
  },
  { id: 3, title: "Education", description: "Your educational background" },
  { id: 4, title: "Review", description: "Confirm your information" },
];

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData>({
    currentCountry: "",
    targetCountries: [],
    profession: "",
    yearsExperience: 0,
    education: EducationLevel.Bachelor,
    languages: [],
    salary: 0,
    email: "",
  });

  const updateFormData = (field: keyof IntakeFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryToggle = (countryCode: string) => {
    const current = formData.targetCountries;
    if (current.includes(countryCode)) {
      updateFormData(
        "targetCountries",
        current.filter((c) => c !== countryCode)
      );
    } else if (current.length < 3) {
      updateFormData("targetCountries", [...current, countryCode]);
    }
  };

  const handleLanguageToggle = (language: string) => {
    const current = formData.languages;
    if (current.includes(language)) {
      updateFormData(
        "languages",
        current.filter((l) => l !== language)
      );
    } else {
      updateFormData("languages", [...current, language]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit(formData);
      }
      // Store in localStorage for demo
      localStorage.setItem("userProfile", JSON.stringify(formData));

      // Create analysis session via API
      const response = await fetch("/api/analysis-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile: formData }),
      });

      const result = await response.json();

      if (result.success && result.data?.sessionId) {
        // Redirect to the specific session detail page
        router.push(`/dashboard/results/${result.data.sessionId}`);
      } else {
        // Fallback to results history if session creation fails
        console.error("Session creation failed:", result.error);
        router.push("/dashboard/results");
      }
    } catch (error) {
      console.error("Submission error:", error);
      router.push("/dashboard/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentCountry">Current Country</Label>
              <Select
                value={formData.currentCountry}
                onValueChange={(value) =>
                  updateFormData("currentCountry", value)
                }
              >
                <SelectTrigger id="currentCountry">
                  <SelectValue placeholder="Select your current country" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Target Countries (Select up to 3)</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {TARGET_COUNTRIES.map((country) => {
                  const isSelected = formData.targetCountries.includes(
                    country.code
                  );
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryToggle(country.code)}
                      disabled={
                        !isSelected && formData.targetCountries.length >= 3
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-lg border p-3 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:border-primary/50 disabled:opacity-50"
                      )}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-sm font-medium">
                        {country.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Select
                value={formData.profession}
                onValueChange={(value) => updateFormData("profession", value)}
              >
                <SelectTrigger id="profession">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                max={50}
                value={formData.yearsExperience || ""}
                onChange={(e) =>
                  updateFormData(
                    "yearsExperience",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter years of experience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (USD)</Label>
              <Input
                id="salary"
                type="number"
                min={0}
                value={formData.salary || ""}
                onChange={(e) =>
                  updateFormData("salary", parseInt(e.target.value) || 0)
                }
                placeholder="Enter your annual salary"
              />
              <p className="text-sm text-muted-foreground">
                Your salary may affect visa eligibility thresholds
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="education">Highest Education Level</Label>
              <Select
                value={formData.education}
                onValueChange={(value) =>
                  updateFormData("education", value as EducationLevel)
                }
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Languages You Speak</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((language) => {
                  const isSelected = formData.languages.includes(language);
                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:border-primary/50"
                      )}
                    >
                      {language}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="your@email.com"
              />
              <p className="text-sm text-muted-foreground">
                We'll send your results to this email
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="mb-4 font-medium">Review Your Information</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">
                    Current Country
                  </dt>
                  <dd className="text-sm font-medium">
                    {TARGET_COUNTRIES.find(
                      (c) => c.code === formData.currentCountry
                    )?.name || "Not selected"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">
                    Target Countries
                  </dt>
                  <dd className="flex gap-1">
                    {formData.targetCountries.map((code) => (
                      <Badge key={code} variant="secondary">
                        {TARGET_COUNTRIES.find((c) => c.code === code)?.name}
                      </Badge>
                    ))}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Profession</dt>
                  <dd className="text-sm font-medium">
                    {formData.profession || "Not selected"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Experience</dt>
                  <dd className="text-sm font-medium">
                    {formData.yearsExperience} years
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Education</dt>
                  <dd className="text-sm font-medium">
                    {
                      EDUCATION_LEVELS.find(
                        (e) => e.value === formData.education
                      )?.label
                    }
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Languages</dt>
                  <dd className="flex flex-wrap gap-1">
                    {formData.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Salary</dt>
                  <dd className="text-sm font-medium">
                    ${formData.salary.toLocaleString()}/year
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="mb-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-1 w-12 rounded md:w-24",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              Analyze My Eligibility
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
