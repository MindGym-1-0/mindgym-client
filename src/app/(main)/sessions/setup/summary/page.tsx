"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readSetup, clearSetup, writeActive, SetupDraft } from "@/lib/session/store";
import { startSession } from "@/lib/session/api";

const PREP_LABELS: Record<string, string> = {
  interview_tomorrow: "Interview tomorrow",
  recruiter_call: "Recruiter call",
  rejection_recovery: "Rejection recovery",
  networking: "Networking",
  salary_negotiation: "Salary negotiation",
  restarting_search: "Restarting my search",
  general_reset: "General reset",
};

const DESIRED_LABELS: Record<string, string> = {
  calm: "calm",
  grounded: "grounded",
  confident: "confident",
  focused: "focused",
  clear_minded: "clear-minded",
  composed: "composed",
};

export default function SummaryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [setup, setSetup] = useState<SetupDraft>({});

  useEffect(() => {
    setSetup(readSetup());
  }, []);

  const handleBegin = async () => {
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const result = await startSession({
        preparation_for: setup.preparation_for!,
        current_feeling: setup.current_feeling!,
        feeling_note: setup.feeling_note,
        desired_feeling: setup.desired_feeling!,
        time_available: setup.time_available!,
        anxiety_level_before: setup.anxiety_level_before!,
        company: setup.company,
        role: setup.role,
      });

      writeActive({
        session_id: result.session_id,
        script: result.script,
        anxiety_level_before: setup.anxiety_level_before!,
      });
      clearSetup();
      router.push("/sessions/active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session. Please try again.");
      setIsLoading(false);
    }
  };

  const prepLabel = setup.preparation_for ? (PREP_LABELS[setup.preparation_for] ?? setup.preparation_for) : "your session";
  const desiredLabel = setup.desired_feeling?.length
    ? setup.desired_feeling.map((v) => DESIRED_LABELS[v] ?? v).join(" and ")
    : null;

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 4 of 4</p>

      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-semibold">Ready when you are</h1>

        <div className="bg-white rounded-3xl p-8 mt-8 border text-left">
          <p className="text-gray-500 mb-4">Your session</p>
          <p className="text-2xl leading-relaxed">
            You&apos;re preparing for {prepLabel}
            {setup.company && setup.role ? ` at ${setup.company} for ${setup.role}` : ""}
            {desiredLabel ? ` and want to feel ${desiredLabel}.` : "."}
          </p>

          <div className="flex gap-3 mt-6 flex-wrap">
            {setup.preparation_for && (
              <div className="bg-yellow-100 px-3 py-1 rounded-full text-sm">
                {prepLabel}
              </div>
            )}
            {setup.current_feeling && (
              <div className="bg-green-100 px-3 py-1 rounded-full text-sm capitalize">
                {setup.current_feeling}
              </div>
            )}
            {setup.time_available && (
              <div className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                {setup.time_available}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => router.push("/sessions/setup/before")}
            disabled={isLoading}
            className="px-5 py-3 rounded-xl border disabled:opacity-50"
          >
            ← Change something
          </button>
          <button
            onClick={handleBegin}
            disabled={isLoading}
            className="bg-[#0C6B58] text-white px-5 py-3 rounded-xl disabled:opacity-50"
          >
            {isLoading ? "Preparing your session..." : "Begin session →"}
          </button>
        </div>
      </div>
    </div>
  );
}
