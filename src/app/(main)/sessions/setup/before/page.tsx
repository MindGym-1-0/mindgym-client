"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeSetup } from "@/lib/session/store";

const anxietyLabels: Record<number, string> = {
  1: "Very calm",
  2: "Mostly calm",
  3: "Slightly tense",
  4: "Some tension",
  5: "Moderate anxiety",
  6: "Noticeably anxious",
  7: "Quite anxious",
  8: "Very anxious",
  9: "Extremely anxious",
  10: "Overwhelmed",
};

export default function BeforePage() {
  const router = useRouter();
  const [value, setValue] = useState(4);

  const handleContinue = () => {
    writeSetup({ anxiety_level_before: value });
    router.push("/sessions/setup/summary");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4]">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="mt-10 flex flex-col items-center">
          <h1 className="max-w-xl text-center text-[34px] font-semibold leading-[42px] text-[#171412]">
            Before your session — how anxious do you feel right now?
          </h1>

          <div className="mt-8 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#126658] text-sm font-semibold text-white">
              M
            </div>
            <div className="max-w-md rounded-xl border border-[#E7E5E4] bg-white px-4 py-3 text-sm text-[#171412] shadow-sm">
              &quot;Before we begin — give me a number. How anxious are you feeling right now, honestly?&quot;
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="text-[72px] font-semibold leading-none text-[#171412]">{value}</div>
            <p className="mt-2 text-sm text-[#686460]">{anxietyLabels[value]}</p>
          </div>

          <div className="mt-10 w-full max-w-xl">
            <input
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D8D5D1]"
            />
            <div className="mt-3 flex justify-between text-xs text-[#9A9691]">
              <span>1 • Calm</span>
              <span>5 • Moderate</span>
              <span>10 • Very high</span>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              onClick={() => router.push("/sessions/setup/time")}
              className="rounded-xl border px-6 py-3 text-sm font-semibold"
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              className="rounded-xl bg-[#126658] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0D4E43]"
            >
              Continue →
            </button>
          </div>

          <p className="mt-5 text-xs text-[#A6A29F]">
            You&apos;ll track again at the session&apos;s end for change.
          </p>
        </div>
      </div>
    </div>
  );
}