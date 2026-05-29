// src/app/(main)/sessions/setup/feelings/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readSetup, writeSetup } from "@/lib/session/store";

const feelings = [
  { label: "Calm", value: "calm" },
  { label: "Grounded", value: "grounded" },
  { label: "Confident", value: "confident" },
  { label: "Focused", value: "focused" },
  { label: "Clear-minded", value: "clear_minded" },
  { label: "Composed", value: "composed" },
];

export default function FeelingsPage() {
  const router = useRouter();
  const setup = readSetup();
  const [selected, setSelected] = useState(setup.desired_feeling ?? "");

  const needsInterviewDetails =
    setup.preparation_for === "interview_tomorrow" ||
    setup.preparation_for === "recruiter_call";

  const handleContinue = () => {
    if (!selected) return;
    writeSetup({ desired_feeling: selected as never });
    router.push("/sessions/setup/time");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 3 of 4</p>

      <div className="text-center">
        <h1 className="text-4xl font-semibold">How would you like to feel?</h1>

        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          {feelings.map((f) => (
            <button
              key={f.value}
              onClick={() => setSelected(f.value)}
              className={`px-5 py-3 rounded-full border transition-all ${
                selected === f.value
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white hover:bg-[#DDF4EE]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() =>
              router.push(
                needsInterviewDetails
                  ? "/sessions/setup/interview-details"
                  : "/sessions/setup/prep-type"
              )
            }
            className="px-5 py-3 rounded-xl border"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-5 py-3 rounded-xl text-white transition-all ${
              selected ? "bg-[#0C6B58] hover:bg-[#084C3F]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}