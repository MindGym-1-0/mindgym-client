"use client";

import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Step1JobRole } from "@/components/Step1JobRole";
import { Step2JobStage } from "@/components/Step2JobStage";
import { Step3MoodSelection } from "@/components/Step3MoodSelection";
import { Step4Plan } from "@/components/Step4PlanProps"; 
import { mockSubmitOnboarding } from "@/lib/mockAPi";

interface StepConfig {
  title: string;
  totalSteps: number;
}

const STEP_CONFIG: Record<number, StepConfig> = {
  1: { title: "Dream direction", totalSteps: 4 },
  2: { title: "Hiring funnel", totalSteps: 4 },
  3: { title: "Emotional challenge", totalSteps: 4 },
  4: { title: "Your plan", totalSteps: 4 }, 
};

export default function OnboardingWizard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobRole: "",
    jobStage: "",
    mood: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canProceed = () => {
    if (currentStep === 1) return formData.jobRole.trim() !== "";
    if (currentStep === 2) return formData.jobStage !== "";
    if (currentStep === 3) return formData.mood.trim() !== "";
    if (currentStep === 4) return true; 
    return false;
  };

  const handleNext = () => {
    // Increased max step threshold to 4
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await mockSubmitOnboarding(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1JobRole
            value={formData.jobRole}
            onChange={(value) => setFormData({ ...formData, jobRole: value })}
          />
        );
      case 2:
        return (
          <Step2JobStage
            value={formData.jobStage}
            onChange={(value) => setFormData({ ...formData, jobStage: value })}
          />
        );
      case 3:
        return (
          <Step3MoodSelection
            value={formData.mood}
            onChange={(value) => setFormData({ ...formData, mood: value })}
          />
        );
      case 4:
        return (
          <Step4Plan 
            formData={formData} /* <-- THIS IS THE CRITICAL LINE */
            onComplete={handleSubmit} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-base py-base flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/mindgym-icon.png" 
              alt="MindGym Logo" 
              width={40}
              height={40}
            />
            <span className="font-display text-h4 text-ink">MindGym</span>
          </div>
          <span className="text-b3 text-ink-60">
            {STEP_CONFIG[currentStep]?.title} · {currentStep} of {STEP_CONFIG[currentStep]?.totalSteps}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-teal-600 transition-all duration-300"
          style={{
            // Updated to divide by 3 to reach 100% at step 4
            width: `${((currentStep - 1) / 3) * 100}%`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-base">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl px-base">
            {renderStep()}
          </div>
        </div>

        {error && (
          <div className="mt-lg p-base bg-error-bg border border-error text-error rounded-lg text-b3 font-semibold max-w-2xl mx-auto w-full">
            {error}
          </div>
        )}

        {/* Footer Navigation (Hidden on Step 4) */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center mt-lg pt-base border-t border-border">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className={`px-base py-2 rounded-lg font-sans text-b2 transition-all duration-200 ${
                currentStep === 1
                  ? "text-ink-30 cursor-not-allowed"
                  : "text-ink hover:bg-background"
              }`}
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-lg py-2 rounded-lg font-sans text-b2 font-semibold transition-all duration-200 ${
                canProceed()
                  ? "bg-teal-600 text-surface hover:bg-teal-900 shadow-sm"
                  : "bg-border text-ink-30 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
