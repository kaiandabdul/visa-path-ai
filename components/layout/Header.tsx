"use client";

import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SunIcon, MoonIcon, MenuIcon, Globe2 } from "lucide-react";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Globe2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">VisaPath AI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#countries"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Countries
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-xl"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/dashboard/intake">
              <Button className="shadow-md shadow-primary/15 font-medium">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
