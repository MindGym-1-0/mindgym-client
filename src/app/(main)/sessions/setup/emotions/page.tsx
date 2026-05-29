// src/app/(main)/sessions/setup/emotions/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeSetup } from "@/lib/session/store";

const emotions = [
  { label: "😟 Overwhelmed", value: "overwhelmed" },
  { label: "😕 Discouraged", value: "discouraged" },
  { label: "😴 Exhausted", value: "exhausted" },
  { label: "😶 Unsure", value: "unsure" },
  { label: "😬 Anxious but hopeful", value: "anxious but hopeful" },
];

export default function EmotionsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [note, setNote] = useState("");

  const handleContinue = () => {
    if (!selected) return;
    writeSetup({ current_feeling: selected as never, feeling_note: note.trim() || undefined });
    router.push("/sessions/setup/prep-type");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <p className="text-[#0C6B58] mb-8">Session setup • Step 1 of 4</p>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold">How are you feeling right now?</h1>
        <p className="text-gray-500 mt-3">Your answer shapes the session Maya prepares for you.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {emotions.map((e) => (
            <button
              key={e.value}
              onClick={() => setSelected(e.value)}
              className={`px-5 py-3 rounded-full border transition-all ${
                selected === e.value
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white hover:bg-[#DDF4EE]"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-3xl p-6 mt-12 border">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Speak or type your answer..."
            className="w-full border rounded-xl px-4 py-4 resize-none outline-none focus:border-[#0C6B58]"
            rows={3}
          />
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/sessions")}
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