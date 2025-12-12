import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TARGET_COUNTRIES, VISA_CATEGORIES } from "@/lib/utils/constants";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]" />
          </div>

          <div className="container-wide">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6">
                AI-Powered Immigration Guidance
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Navigate Your{" "}
                <span className="gradient-text">Visa Pathway</span>
                <br />
                with Confidence
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Get personalized visa recommendations, eligibility analysis, and
                step-by-step guidance for your international relocation journey.
                Powered by advanced AI.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/dashboard/intake">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Assessment
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>12+ Countries Covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>50+ Visa Types</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>AI-Powered Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="border-t border-border bg-surface py-20"
        >
          <div className="container-wide">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Everything You Need for Your Visa Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                From initial assessment to application tracking, we&apos;ve got
                you covered.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Eligibility Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant eligibility scores for different visa types
                    based on your profile and qualifications.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    AI Chat Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions about visa requirements, timelines, and
                    processes. Get instant, accurate answers.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Timeline Forecasting
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get realistic processing time estimates based on current
                    trends and your specific situation.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 text-warning">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Cost Calculator
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Understand the full cost of your visa journey including
                    fees, legal costs, and relocation expenses.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-error/10 text-error">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Document Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upload documents for analysis and get suggestions to improve
                    your application materials.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Pathway Comparison
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Compare different visa options side by side to find the best
                    path for your goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Countries Section */}
        <section className="py-20">
          <div className="container-wide">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
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
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                >
                  <span className="text-4xl">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visa Categories */}
        <section className="border-t border-border bg-surface py-20">
          <div className="container-wide">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
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
                  className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 transition-colors hover:border-primary/50"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container-wide">
            <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 md:p-12 lg:p-16">
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                  Ready to Start Your Journey?
                </h2>
                <p className="mb-8 text-lg text-white/80">
                  Take our free assessment and discover your best visa options
                  in under 5 minutes.
                </p>
                <Link href="/dashboard/intake">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Start Free Assessment
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
