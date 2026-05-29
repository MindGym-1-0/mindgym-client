"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeSetup } from "@/lib/session/store";

const LABEL_MAP: Record<number, string> = {
  1: "Very calm",
  2: "Calm",
  3: "Mostly calm",
  4: "Slight tension",
  5: "Some tension — still present",
  6: "Moderately anxious",
  7: "Quite anxious",
  8: "Very anxious",
  9: "Highly anxious",
  10: "Extremely anxious",
};

export default function SessionEmotionsPage() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(4);

  const handleBegin = () => {
    writeSetup({ anxiety_level_before: selectedValue });
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
              "Before we begin — give me a number.
              How anxious are you feeling right now, honestly?"
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="text-[72px] font-semibold leading-none text-[#171412]">
              {selectedValue}
            </div>
            <p className="mt-2 text-sm text-[#686460]">
              {LABEL_MAP[selectedValue]}
            </p>
          </div>

          <div className="mt-10 w-full max-w-xl">
            <input
              type="range"
              min="1"
              max="10"
              value={selectedValue}
              onChange={(e) => setSelectedValue(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D8D5D1]"
            />
            <div className="mt-3 flex justify-between text-xs text-[#9A9691]">
              <span>1 • Calm</span>
              <span>5 • Moderate</span>
              <span>10 • Very high</span>
            </div>
          </div>

          <button
            onClick={handleBegin}
            className="mt-10 rounded-xl bg-[#126658] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0D4E43]"
          >
            Begin session →
          </button>

          <p className="mt-5 text-xs text-[#A6A29F]">
            You&apos;ll track again at the session&apos;s end for change.
          </p>
        </div>
      </div>
    </div>
  );
}
