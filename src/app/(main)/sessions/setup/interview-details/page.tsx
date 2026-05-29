// src/app/(main)/sessions/setup/interview-details/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readSetup, writeSetup } from "@/lib/session/store";

export default function InterviewDetailsPage() {
  const setup = readSetup();
  const router = useRouter();
  const [company, setCompany] = useState(setup.company ?? "");
  const [role, setRole] = useState(setup.role ?? "");

  const canContinue = company.trim() !== "" && role.trim() !== "";

  const handleContinue = () => {
    if (!canContinue) return;
    writeSetup({ company: company.trim(), role: role.trim() });
    router.push("/sessions/setup/feelings");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] px-8 py-8">
      <p className="text-sm text-[#126658]">Session setup • Interview details</p>

      <div className="mx-auto mt-24 max-w-2xl">
        <h1 className="text-center text-[42px] font-semibold leading-[52px] text-[#171412]">
          Tell us about your interview
        </h1>
        <p className="mt-4 text-center text-base text-[#686460]">
          This helps personalize your coaching session and preparation.
        </p>

        <div className="mt-14 space-y-8">
          <div>
            <label className="mb-3 block text-sm font-semibold text-[#171412]">
              Which company is it with?
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Amazon, Meta..."
              className="w-full rounded-2xl border border-[#D8D5D1] bg-white px-5 py-4 text-base outline-none transition-all focus:border-[#126658]"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-[#171412]">
              What role are you interviewing for?
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-2xl border border-[#D8D5D1] bg-white px-5 py-4 text-base outline-none transition-all focus:border-[#126658]"
            />
          </div>
        </div>

        <div className="mt-14 flex items-center justify-center gap-4">
          <button
            onClick={() => router.push("/sessions/setup/prep-type")}
            className="rounded-2xl border border-[#D8D5D1] bg-white px-6 py-3 text-sm font-medium text-[#171412] transition-all hover:bg-[#F2F1EF]"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all ${
              canContinue ? "bg-[#126658] hover:bg-[#0D4E43]" : "cursor-not-allowed bg-[#9CA3AF]"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}