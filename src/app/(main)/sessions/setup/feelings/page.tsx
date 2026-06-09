"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readSetup, writeSetup } from "@/lib/session/store";

const FEELINGS = [
  { label: "Calm", value: "calm" },
  { label: "Grounded", value: "grounded" },
  { label: "Confident", value: "confident" },
  { label: "Focused", value: "focused" },
  { label: "Clear-minded", value: "clear_minded" },
  { label: "Composed", value: "composed" },
];

const MODE1 = new Set(["interview_tomorrow", "recruiter_call"]);

export default function FeelingsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [backHref, setBackHref] = useState("/sessions/setup/prep-type");

  useEffect(() => {
    const setup = readSetup();
    if (setup.preparation_for && MODE1.has(setup.preparation_for)) {
      setBackHref("/sessions/setup/interview-details");
    }
  }, []);

  const toggle = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 2) return prev;
      return [...prev, value];
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    writeSetup({ desired_feeling: selected as ReturnType<typeof readSetup>['desired_feeling'] });
    router.push("/sessions/setup/time");
  };

  const atMax = selected.length >= 2;

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 3 of 4</p>

      <div className="text-center">
        <h1 className="text-4xl font-semibold">How would you like to feel?</h1>
        <p className="text-gray-500 mt-2">Choose up to 2</p>

        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          {FEELINGS.map((f) => {
            const isSelected = selected.includes(f.value);
            const isDisabled = atMax && !isSelected;
            return (
              <button
                key={f.value}
                onClick={() => toggle(f.value)}
                disabled={isDisabled}
                className={`px-5 py-3 rounded-full border transition-all ${
                  isSelected
                    ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                    : isDisabled
                    ? "bg-white text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white hover:bg-[#DDF4EE]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => router.push(backHref)}
            className="px-5 py-3 rounded-xl border"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`px-5 py-3 rounded-xl text-white transition-all ${
              selected.length > 0 ? "bg-[#0C6B58] hover:bg-[#084C3F]" : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
