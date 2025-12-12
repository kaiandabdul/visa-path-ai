import type { Metadata } from "next";
import { IntakeForm } from "@/components/forms/IntakeForm";

export const metadata: Metadata = {
  title: "Intake Form",
  description:
    "Tell us about yourself to get personalized visa recommendations",
};

export default function IntakePage() {
  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Answer a few questions to get personalized visa pathway
          recommendations
        </p>
      </div>
      <IntakeForm />
    </div>
  );
}
