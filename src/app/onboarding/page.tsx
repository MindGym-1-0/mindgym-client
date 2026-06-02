"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Step1Employment } from "@/components/Step1Employment";
import { Step2SearchTimeline } from "@/components/Step2SearchTimeline";
import { Step3TargetTimeline } from "@/components/Step3TargetTimeline";
import { Step4RoleDirection } from "@/components/Step4RoleDirection";
import { Step5CompanyType } from "@/components/Step5CompanyType";
import { Step6ActivityMetrics } from "@/components/Step6ActivityMetrics";
import { Step7EmotionChallenge } from "@/components/Step7EmotionChallenge";
import { Step8BaselineAnxiety } from "@/components/Step8BaselineAnxiety";
import { Step9Summary } from "@/components/Step9Summary";

import { supabase } from "@/lib/supabase/client";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const TOTAL_STEPS = 9;

const COMPANY_MAP: Record<string, string> = {
  "Startup (seed-series B)": "startup",
  "Scale-up / Growth stage": "scale_up",
  "Large tech / FAANG": "large_tech",
  "Enterprise / Corporate": "enterprise",
  "Any company size": "any",
};

const ROLE_MAP: Record<string, string> = {
  "Product Design / UX": "product_design_ux",
  "Product Management": "product_management",
  "Software Engineering": "software_engineering",
  "Data / Analytics": "data_analytics",
  Marketing: "marketing",
  Sales: "sales",
  Operations: "operations",
  Finance: "finance",
  "People / HR": "people_hr",
  "Leadership / Executive": "leadership_executive",
};

const TIMELINE_MAP: Record<string, string> = {
  "As soon as possible": "asap",
  "Within 3 months": "3m",
  "Within 6 months": "6m",
  "Within 12 months": "12m",
};

const CHALLENGE_MAP: Record<string, string> = {
  "Rejection and silence": "rejection_silence",
  "Interview anxiety": "interview_anxiety",
  "Imposter syndrome": "imposter_syndrome",
  "Burnout": "burnout",
  "Uncertainty": "uncertainty",
  "Financial pressure": "financial_pressure",
};

export default function OnboardingWizard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    employmentStatus: "",
    searchTimeline: "",
    targetTimeline: "",
    role: "",
    companyType: "",
    activity: {
      applications: 0,
      recruiterCalls: 0,
      interviews: 0,
      finalRounds: 0,
      offers: 0,
    },
    emotionalChallenge: "",
    anxiety: 5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.employmentStatus !== "";
      case 2:
        return formData.searchTimeline !== "";
      case 3:
        return formData.targetTimeline !== "";
      case 4:
        return formData.role.trim() !== "";
      case 5:
        return formData.companyType !== "";
      case 6:
        return true;
      case 7:
        return formData.emotionalChallenge !== "";
      case 8:
        return formData.anxiety > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 9) {
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
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employment_status:
            formData.employmentStatus === "employed"
              ? "employed"
              : formData.employmentStatus === "laid_off"
              ? "laid_off"
              : "unemployed",

          unemployed_duration:
            formData.employmentStatus === "employed"
              ? null
              : formData.searchTimeline,

          job_timeline:
            TIMELINE_MAP[formData.targetTimeline] ?? formData.targetTimeline,

          target_role_category:
            ROLE_MAP[formData.role] ?? "not_sure",

          target_role_note: formData.role,

          company_types: [COMPANY_MAP[formData.companyType]],

          applications_sent_min: formData.activity.applications,
          applications_sent_max: formData.activity.applications,
          recruiter_contacts: formData.activity.recruiterCalls,
          first_round_interviews: formData.activity.interviews,
          final_round_interviews: formData.activity.finalRounds,
          offers: formData.activity.offers,

          emotional_challenge:
            CHALLENGE_MAP[formData.emotionalChallenge] ?? formData.emotionalChallenge,

          baseline_anxiety: formData.anxiety,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Onboarding failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Employment
            value={formData.employmentStatus}
            onChange={(value) =>
              setFormData({ ...formData, employmentStatus: value })
            }
          />
        );
      case 2:
        return (
          <Step2SearchTimeline
            value={formData.searchTimeline}
            onChange={(value) =>
              setFormData({ ...formData, searchTimeline: value })
            }
          />
        );
      case 3:
        return (
          <Step3TargetTimeline
            value={formData.targetTimeline}
            onChange={(value) =>
              setFormData({ ...formData, targetTimeline: value })
            }
          />
        );
      case 4:
        return (
          <Step4RoleDirection
            value={formData.role}
            onChange={(value) =>
              setFormData({ ...formData, role: value })
            }
          />
        );
      case 5:
        return (
          <Step5CompanyType
            value={formData.companyType}
            onChange={(value) =>
              setFormData({ ...formData, companyType: value })
            }
          />
        );
      case 6:
        return (
          <Step6ActivityMetrics
            value={formData.activity}
            onChange={(value) =>
              setFormData({ ...formData, activity: value })
            }
          />
        );
      case 7:
        return (
          <Step7EmotionChallenge
            value={formData.emotionalChallenge}
            onChange={(value) =>
              setFormData({ ...formData, emotionalChallenge: value })
            }
          />
        );
      case 8:
        return (
          <Step8BaselineAnxiety
            value={formData.anxiety}
            onChange={(value) =>
              setFormData({ ...formData, anxiety: value })
            }
          />
        );
      case 9:
        return (
          <Step9Summary
            formData={formData}
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
          <p className="text-sm text-[#686460]">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="h-[2px] w-full bg-[#E7E5E4]">
        <div
          className="h-full bg-[#126658] transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / 8) * 100}%`,
          }}
        />
      </div>

      {/* MAIN */}
      <main className="flex flex-1 flex-col">
        {/* CONTENT */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-3xl">{renderStep()}</div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-auto mb-6 w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FOOTER BUTTONS */}
        {currentStep < 9 && (
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