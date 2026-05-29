"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeSetup } from "@/lib/session/store";

const TIMES = ["5 min", "10 min", "15 min"];

export default function TimePage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleContinue = () => {
    if (!selected) return;
    writeSetup({ time_available: selected });
    router.push("/sessions/setup/before");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 3b of 4</p>

      <div className="text-center">
        <h1 className="text-4xl font-semibold">How much time do you have?</h1>

        <div className="flex justify-center gap-4 mt-8">
          {TIMES.map((time) => (
            <button
              key={time}
              onClick={() => setSelected(time)}
              className={`px-6 py-4 rounded-2xl border transition-all ${
                selected === time
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white hover:bg-[#DDF4EE]"
              }`}
            >
              {time}
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
