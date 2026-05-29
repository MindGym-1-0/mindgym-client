"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readActive, clearActive } from "@/lib/session/store";
import { completeSession } from "@/lib/session/api";

type Result = {
  before: number;
  after: number;
  delta: number;
};

export default function FeedbackPage() {
  const router = useRouter();
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const session = readActive();

  const handleSubmit = async () => {
    if (!session || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await completeSession(session.session_id, anxietyAfter);
      clearActive();
      setResult({
        before: res.anxiety_level_before,
        after: res.anxiety_level_after,
        delta: res.anxiety_level_delta,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save session.");
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#F6F6F4] p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-semibold">Session complete</h1>
          <p className="text-gray-500 mt-3">Even a small shift is progress.</p>

          <div className="bg-white rounded-3xl p-8 mt-10 border">
            <p className="text-4xl font-semibold">
              {result.before} → {result.after}
            </p>
            <p className="text-gray-500 mt-3 text-lg">
              {result.delta < 0
                ? `Anxiety dropped by ${Math.abs(result.delta)} point${Math.abs(result.delta) !== 1 ? "s" : ""}. That shift is real.`
                : result.delta === 0
                ? "You stayed steady through it. That counts."
                : "Noticing the feeling is the first step."}
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-10 bg-[#0C6B58] text-white px-5 py-3 rounded-xl"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-semibold">How do you feel now?</h1>
        <p className="text-gray-500 mt-3">Even a small shift is progress.</p>

        <div className="bg-white rounded-3xl p-8 mt-10 border">
          <p className="text-lg font-medium mb-6">Rate your anxiety level now (1–10)</p>

          <div className="text-[72px] font-semibold leading-none text-[#171412]">
            {anxietyAfter}
          </div>

          <div className="mt-8">
            <input
              type="range"
              min="1"
              max="10"
              value={anxietyAfter}
              onChange={(e) => setAnxietyAfter(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D8D5D1]"
            />
            <div className="mt-3 flex justify-between text-xs text-[#9A9691]">
              <span>1 • Calm</span>
              <span>5 • Moderate</span>
              <span>10 • Very high</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !session}
            className="bg-[#0C6B58] text-white px-5 py-3 rounded-xl disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save session →"}
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="border px-5 py-3 rounded-xl bg-white"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
