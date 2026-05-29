// src/app/(main)/sessions/setup/summary/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readSetup, writeActive, clearSetup } from "@/lib/session/store";

const PREP_LABELS: Record<string, string> = {
  interview_tomorrow: "Interview tomorrow",
  recruiter_call: "Recruiter call",
  rejection_recovery: "Rejection recovery",
  networking: "Networking",
  salary_negotiation: "Salary negotiation",
  restarting_search: "Restarting my search",
  general_reset: "General reset",
};

const FEELING_LABELS: Record<string, string> = {
  overwhelmed: "Overwhelmed",
  discouraged: "Discouraged",
  exhausted: "Exhausted",
  unsure: "Unsure",
  "anxious but hopeful": "Anxious but hopeful",
};

const DESIRED_LABELS: Record<string, string> = {
  calm: "Calm",
  grounded: "Grounded",
  confident: "Confident",
  focused: "Focused",
  clear_minded: "Clear-minded",
  composed: "Composed",
};

export default function SummaryPage() {
  const router = useRouter();
  const setup = readSetup();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBegin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            preparation_for: setup.preparation_for,
            current_feeling: setup.current_feeling,
            feeling_note: setup.feeling_note ?? null,
            desired_feeling: setup.desired_feeling,
            time_available: setup.time_available,
            anxiety_level_before: setup.anxiety_level_before,
            company: setup.company ?? null,
            role: setup.role ?? null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail ?? "Session generation failed. Please try again.");
        return;
      }

      writeActive({
        session_id: data.session_id,
        script: data.script,
        anxiety_level_before: setup.anxiety_level_before!,
      });
      clearSetup();
      router.push("/sessions/active");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 4 of 4</p>

      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-semibold">Ready when you are</h1>

        <div className="bg-white rounded-3xl p-8 mt-8 border text-left">
          <p className="text-gray-500 mb-4">Your session</p>
          <p className="text-2xl leading-relaxed">
            You&apos;re preparing for{" "}
            <span className="font-semibold">
              {PREP_LABELS[setup.preparation_for ?? ""] ?? setup.preparation_for}
            </span>
            {setup.company && setup.role && (
              <span>
                {" "}at <span className="font-semibold">{setup.company}</span> for the{" "}
                <span className="font-semibold">{setup.role}</span> role
              </span>
            )}
            {" "}and want to feel{" "}
            <span className="font-semibold">
              {DESIRED_LABELS[setup.desired_feeling ?? ""] ?? setup.desired_feeling}
            </span>
            .
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {setup.preparation_for && (
              <div className="bg-yellow-100 px-3 py-1 rounded-full text-sm">
                {PREP_LABELS[setup.preparation_for]}
              </div>
            )}
            {setup.current_feeling && (
              <div className="bg-orange-100 px-3 py-1 rounded-full text-sm">
                Feeling: {FEELING_LABELS[setup.current_feeling] ?? setup.current_feeling}
              </div>
            )}
            {setup.desired_feeling && (
              <div className="bg-green-100 px-3 py-1 rounded-full text-sm">
                {DESIRED_LABELS[setup.desired_feeling]}
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
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            className="bg-[#0C6B58] text-white px-5 py-3 rounded-xl hover:bg-[#084C3F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Preparing your session..." : "Begin session →"}
          </button>
        </div>
      </div>
    </div>
  );
}