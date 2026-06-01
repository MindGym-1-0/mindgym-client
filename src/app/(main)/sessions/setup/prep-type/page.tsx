"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { writeSetup, readSetup } from "@/lib/session/store";

const TYPES = [
  { label: "Interview tomorrow", value: "interview_tomorrow" },
  { label: "Recruiter call", value: "recruiter_call" },
  { label: "Rejection recovery", value: "rejection_recovery" },
  { label: "Networking", value: "networking" },
  { label: "Salary negotiation", value: "salary_negotiation" },
  { label: "Restarting my search", value: "restarting_search" },
  { label: "General reset", value: "general_reset" },
];

const MODE1 = new Set(["interview_tomorrow", "recruiter_call"]);

export default function PrepTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const setup = readSetup();
    if (setup.preparation_for) {
      router.replace(
        MODE1.has(setup.preparation_for)
          ? "/sessions/setup/interview-details"
          : "/sessions/setup/feelings"
      );
    }
  }, [router]);

  const handleContinue = () => {
    if (!selected) return;
    writeSetup({ preparation_for: selected });
    router.push(MODE1.has(selected) ? "/sessions/setup/interview-details" : "/sessions/setup/feelings");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="mb-8 text-[#0C6B58]">Session setup • Step 2 of 4</p>

      <div className="text-center">
        <h1 className="text-4xl font-semibold text-[#171412]">What are you preparing for?</h1>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelected(t.value)}
              className={`rounded-full border px-5 py-3 transition-all ${
                selected === t.value
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white hover:bg-[#DDF4EE]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => router.push("/sessions/setup/emotions")}
            className="rounded-xl border border-[#D8D5D1] bg-white px-5 py-3"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`rounded-xl px-5 py-3 text-white transition-all ${
              selected ? "bg-[#0C6B58] hover:bg-[#084C3F]" : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}