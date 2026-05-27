"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    if (currentStep === 1) {
      return formData.jobRole.trim() !== "";
    }

    if (currentStep === 2) {
      return formData.jobStage !== "";
    }

    if (currentStep === 3) {
      return formData.mood.trim() !== "";
    }

    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      await mockSubmitOnboarding(formData);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1JobRole
            value={formData.jobRole}
            onChange={(value) =>
              setFormData({
                ...formData,
                jobRole: value,
              })
            }
          />
        );

      case 2:
        return (
          <Step2JobStage
            value={formData.jobStage}
            onChange={(value) =>
              setFormData({
                ...formData,
                jobStage: value,
              })
            }
          />
        );

      case 3:
        return (
          <Step3MoodSelection
            value={formData.mood}
            onChange={(value) =>
              setFormData({
                ...formData,
                mood: value,
              })
            }
          />
        );

      case 4:
        return (
          <Step4Plan
            formData={formData}
            onComplete={handleSubmit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
      
      {/* HEADER */}
      <header className="border-b border-[#E7E5E4] bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
          
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MindGym Logo"
              width={120}
              height={36}
              priority
            />
          </div>

          {/* RIGHT */}
          <p className="text-sm text-[#686460]">
            {STEP_CONFIG[currentStep]?.title} ·{" "}
            {currentStep} of{" "}
            {STEP_CONFIG[currentStep]?.totalSteps}
          </p>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="h-[2px] w-full bg-[#E7E5E4]">
        <div
          className="h-full bg-[#126658] transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / 3) * 100}%`,
          }}
        />
      </div>

      {/* MAIN */}
      <main className="flex flex-1 flex-col">
        
        {/* CONTENT */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-3xl">
            {renderStep()}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-auto mb-6 w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FOOTER BUTTONS */}
        {currentStep < 4 && (
          <div className="border-t border-[#E7E5E4] bg-white px-8 py-5">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                  currentStep === 1
                    ? "cursor-not-allowed text-gray-300"
                    : "text-[#171412] hover:bg-gray-100"
                }`}
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                  canProceed()
                    ? "bg-[#126658] text-white hover:bg-[#0E4E43]"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}