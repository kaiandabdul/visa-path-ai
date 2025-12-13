import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TARGET_COUNTRIES, VISA_CATEGORIES } from "@/lib/utils/constants";
import {
  Globe2,
  FileCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-36 texture-dots">
          {/* Decorative elements - subtle, no gradients */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full border border-primary/10" />
            <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full border border-accent/10" />
            <div className="absolute bottom-20 right-1/4 h-40 w-40 rounded-full bg-primary/5" />
          </div>

          <div className="container-wide">
            <div className="mx-auto max-w-4xl text-center">
              <Badge
                variant="secondary"
                className="mb-8 px-4 py-2 text-sm font-medium border border-primary/20 bg-primary/5 text-primary"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                AI-Powered Immigration Guidance
              </Badge>
              <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl font-serif">
                Navigate Your{" "}
                <span className="gradient-text">Visa Pathway</span>
                <br />
                <span className="text-muted-foreground font-sans font-normal text-3xl md:text-4xl lg:text-5xl">
                  with Confidence
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Get personalized visa recommendations, eligibility analysis, and
                step-by-step guidance for your international relocation journey.
                Powered by advanced AI.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/dashboard/intake">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all">
                    Start Your Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 text-base font-medium border-2"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Globe2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">12+ Countries</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">50+ Visa Types</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="border-t border-border bg-surface py-24"
        >
          <div className="container-wide">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl font-serif">
                Everything You Need for Your Visa Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                From initial assessment to application tracking, we&apos;ve got
                you covered.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <Card className="group card-hover border-2 border-transparent hover:border-primary/20 bg-card">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Eligibility Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get instant eligibility scores for different visa types
                    based on your profile and qualifications.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="group card-hover border-2 border-transparent hover:border-accent/20 bg-card">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    AI Chat Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask questions about visa requirements, timelines, and
                    processes. Get instant, accurate answers.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="group card-hover border-2 border-transparent hover:border-primary/20 bg-card">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Timeline Forecasting
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get realistic processing time estimates based on current
                    trends and your specific situation.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="group card-hover border-2 border-transparent hover:border-amber-500/20 bg-card">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Cost Calculator
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Understand the full cost of your visa journey including
                    fees, legal costs, and relocation expenses.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="group card-hover border-2 border-transparent hover:border-rose-500/20 bg-card">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Document Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload documents for analysis and get suggestions to improve
                    your application materials.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="group card-hover border-2 border-transparent hover:border-primary/20 bg-card">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Pathway Comparison
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Compare different visa options side by side to find the best
                    path for your goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Countries Section */}
        <section className="py-24">
          <div className="container-wide">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl font-serif">
                Popular Destinations
              </h2>
              <p className="text-lg text-muted-foreground">
                We support visa analysis for top relocation destinations
                worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {TARGET_COUNTRIES.map((country) => (
                <div
                  key={country.code}
                  className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visa Categories */}
        <section className="border-t border-border bg-surface py-24">
          <div className="container-wide">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl font-serif">
                Visa Categories We Cover
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you&apos;re looking to work, study, or start a business
                abroad.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {VISA_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-full border-2 border-border bg-card px-6 py-3.5 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container-wide">
            <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 md:p-14 lg:p-20">
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border border-background/10" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full border border-background/10" />
                <div className="absolute top-1/2 left-1/4 h-20 w-20 rounded-full bg-primary/20" />
              </div>
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="mb-5 text-3xl font-bold text-background md:text-4xl font-serif">
                  Ready to Start Your Journey?
                </h2>
                <p className="mb-10 text-lg text-background/70 leading-relaxed">
                  Take our free assessment and discover your best visa options
                  in under 5 minutes.
                </p>
                <Link href="/dashboard/intake">
                  <Button
                    size="lg"
                    className="bg-background text-foreground hover:bg-background/90 h-12 px-8 text-base font-medium shadow-xl"
                  >
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
