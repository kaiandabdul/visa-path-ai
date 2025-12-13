"use client";

import { Suspense } from "react";
import { SignInForm } from "./SignInForm";
import { Spinner } from "@/components/ui/spinner";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
