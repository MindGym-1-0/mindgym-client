// src/app/(main)/sessions/setup/time/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readSetup, writeSetup } from "@/lib/session/store";

const times = ["5 min", "10 min", "15 min"] as const;

export default function TimePage() {
  const router = useRouter();
  const setup = readSetup();
  const [selected, setSelected] = useState<string>(setup.time_available ?? "");

  const handleContinue = () => {
    if (!selected) return;
    writeSetup({ time_available: selected as never });
    router.push("/sessions/setup/before");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 3b of 4</p>

      <div className="text-center">
        <h1 className="text-4xl font-semibold">How much time do you have?</h1>

        <div className="flex justify-center gap-4 mt-8">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => setSelected(t)}
              className={`px-6 py-4 rounded-2xl border transition-all ${
                selected === t
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white hover:bg-[#DDF4EE]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => router.push("/sessions/setup/feelings")}
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