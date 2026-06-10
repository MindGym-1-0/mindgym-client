"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readActive, clearActive, readSetup, clearSetup } from "@/lib/session/store";
import { completeSession, getSessionDetail, type RecommendedAction } from "@/lib/session/api";
import { writeActive } from "@/lib/session/store";
import {
  sessionTitle,
  preparationLabel,
  sessionModality,
  timeLabel,
  anxietyLabel,
  feelingChipLabel,
  feelingReflection,
  closingMessage,
  nextSessionLabel,
} from "@/lib/session/session_copy";

type SessionResult = {
  session_id: string;
  preparation_for: string;
  desired_feeling: string[] | null;
  time_available: string | null;
  anxiety_level_before: number;
  anxiety_level_after: number;
  anxiety_level_delta: number;
  completed_at: string;
  session_number: number;
  recommended_actions: RecommendedAction[];
};

// TODO: remove once UI is aligned — shows result screen directly
const PREVIEW_RESULT: SessionResult = {
  session_id: "preview",
  preparation_for: "rejection_recovery",
  desired_feeling: ["focused", "grounded", "calm"],
  time_available: "10 min",
  anxiety_level_before: 7,
  anxiety_level_after: 4,
  anxiety_level_delta: -3,
  completed_at: new Date().toISOString(),
  session_number: 1,
  recommended_actions: [
    { title: "Name the narrative", body: "Write one sentence about what this rejection taught you — not what it says about you.", timing: "Today" },
    { title: "Return to your evidence", body: "Re-read your last 3 wins — applications, interviews, kind feedback. They're still true.", timing: "Ongoing" },
    { title: "Reach out to one person", body: "Send a message to someone in your network — not to ask for a job, just to stay warm.", timing: "Tomorrow" },
  ],
};

function formatCompletedAt(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return isToday
    ? `Today · ${time}`
    : `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · ${time}`;
}

function AnxietyShiftBar({ before, after }: { before: number; after: number }) {
  const beforePct = ((before - 1) / 9) * 100;
  const afterPct = ((after - 1) / 9) * 100;
  const delta = after - before;
  const minPct = Math.min(beforePct, afterPct);
  const maxPct = Math.max(beforePct, afterPct);

  return (
    <div className="relative h-2 bg-[#E8E5E1] rounded-full my-2">
      <div
        className="absolute top-0 h-full rounded-full bg-[#C8E6C0]"
        style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
      />
      {/* Before dot — red */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E85A4F] border-2 border-white shadow-sm"
        style={{ left: `${beforePct}%` }}
      />
      {/* After dot — green, with delta bubble */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0C6B58] border-2 border-white shadow-sm"
        style={{ left: `${afterPct}%` }}
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0C6B58] text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
          {delta > 0 ? `+${delta}` : delta}
        </div>
      </div>
    </div>
  );
}

function ResultView({
  result,
  onDashboard,
  onReplay,
  isReplaying,
}: {
  result: SessionResult;
  onDashboard: () => void;
  onReplay: () => void;
  isReplaying: boolean;
}) {
  const {
    preparation_for,
    desired_feeling,
    time_available,
    anxiety_level_before: before,
    anxiety_level_after: after,
    completed_at,
    session_number,
    recommended_actions: actions,
  } = result;

  return (
    <div className="min-h-screen bg-[#F6F6F4]">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-[#171412] leading-snug">
            {sessionTitle(preparation_for)}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              {preparationLabel(preparation_for)}
            </span>
            {time_available && (
              <span className="px-3 py-1 rounded-full text-xs bg-[#E8E5E1] text-[#6B6864]">
                {timeLabel(time_available)}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs bg-[#E8E5E1] text-[#6B6864]">
              {sessionModality(preparation_for)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-[#E8E5E1] text-[#6B6864]">
              {formatCompletedAt(completed_at)}
            </span>
          </div>
        </div>

        {/* Anxiety shift */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E5E1]">
          <div className="flex items-center gap-6">
            <div className="text-center min-w-[80px]">
              <div className="text-5xl font-bold text-[#171412]">{before}</div>
              <div className="text-xs font-medium text-[#171412] mt-1">{anxietyLabel(before)}</div>
              <div className="text-xs text-[#9A9691] mt-1">Before</div>
            </div>
            <div className="flex-1 px-2">
              <AnxietyShiftBar before={before} after={after} />
            </div>
            <div className="text-center min-w-[80px]">
              <div className="text-5xl font-bold text-[#0C6B58]">{after}</div>
              <div className="text-xs font-medium text-[#171412] mt-1">{anxietyLabel(after)}</div>
              <div className="text-xs text-[#9A9691] mt-1">After</div>
            </div>
          </div>
        </div>

        {/* How you said you felt */}
        {desired_feeling && desired_feeling.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8E5E1]">
            <h2 className="text-xs font-semibold text-[#9A9691] uppercase tracking-widest mb-3">
              How you said you felt
            </h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {desired_feeling.map((f) => (
                <span
                  key={f}
                  className="px-4 py-1.5 rounded-full bg-[#F0F7F5] text-[#0C6B58] text-sm font-medium"
                >
                  {feelingChipLabel(f)}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#171412] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                M
              </div>
              <p className="text-sm text-[#6B6864] italic leading-relaxed">
                &ldquo;{feelingReflection(desired_feeling)}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Recommended actions */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E5E1]">
          <h2 className="text-xs font-semibold text-[#9A9691] uppercase tracking-widest mb-4">
            Recommended actions
          </h2>
          <div className="space-y-3">
            {actions.map((action, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-[#F6F6F4]">
                <div className="w-5 h-5 rounded-full bg-[#0C6B58] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#171412]">{action.title}</p>
                    <span className="px-2 py-0.5 rounded-full bg-[#E8E5E1] text-[#9A9691] text-xs flex-shrink-0">
                      {action.timing}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B6864] mt-1 leading-relaxed">{action.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maya closing card */}
        <div className="bg-[#171412] rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#2C2925] text-white flex items-center justify-center text-xs font-semibold">
              M
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2C2925] text-[#9A9691] text-xs">
              Frank Mode
            </span>
          </div>
          <p className="text-white text-sm leading-relaxed">
            {closingMessage(before, after, session_number)}
          </p>
          <div className="border-t border-[#2C2925] mt-5 pt-4">
            <p className="text-[#6B6864] text-xs leading-relaxed">
              Session {session_number} of your journey
              {" · "}
              Anxiety baseline: {before} → {after}
              {" · "}
              Next: {nextSessionLabel(preparation_for)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 pt-2 pb-8">
          <div className="flex gap-3">
            <button
              onClick={onDashboard}
              className="border border-[#D8D5D1] bg-white text-[#171412] px-5 py-2.5 rounded-xl text-sm hover:bg-[#F6F6F4] transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={onReplay}
              disabled={isReplaying}
              className="bg-[#0C6B58] text-white px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-[#0A5B4A] transition-colors"
            >
              {isReplaying ? "Loading..." : "Replay"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const router = useRouter();
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SessionResult | null>(null);

  const session = readActive();

  const handleSubmit = async () => {
    if (!session || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await completeSession(session.session_id, anxietyAfter);
      const setup = readSetup();
      const sessionId = session.session_id;
      clearActive();
      clearSetup();
      setResult({
        session_id: sessionId,
        preparation_for: setup.preparation_for ?? "general_reset",
        desired_feeling: (setup.desired_feeling as string[] | undefined) ?? null,
        time_available: setup.time_available ?? null,
        anxiety_level_before: res.anxiety_level_before,
        anxiety_level_after: res.anxiety_level_after,
        anxiety_level_delta: res.anxiety_level_delta,
        completed_at: new Date().toISOString(),
        session_number: res.session_number,
        recommended_actions: res.recommended_actions,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save session.");
      setIsLoading(false);
    }
  };

  const handleReplay = async () => {
    if (!result || result.session_id === "preview" || isReplaying) return;
    setIsReplaying(true);
    try {
      const detail = await getSessionDetail(result.session_id);
      writeActive({
        session_id: detail.id,
        script: detail.script,
        anxiety_level_before: result.anxiety_level_before,
      });
      router.push("/sessions/active");
    } catch {
      setIsReplaying(false);
    }
  };

  if (result) {
    return (
      <ResultView
        result={result}
        onDashboard={() => router.push("/dashboard")}
        onReplay={handleReplay}
        isReplaying={isReplaying}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-[#171412]">How do you feel now?</h1>
        <p className="text-[#9A9691] mt-3">Even a small shift is progress.</p>

        <div className="bg-white rounded-3xl p-8 mt-8 border border-[#E8E5E1]">
          <p className="text-sm font-medium text-[#6B6864] mb-6">Rate your anxiety level now (1–10)</p>
          <div className="text-[72px] font-bold leading-none text-[#171412]">{anxietyAfter}</div>
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
              <span>1 · Calm</span>
              <span>5 · Moderate</span>
              <span>10 · Very high</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !session}
            className="bg-[#0C6B58] text-white px-6 py-3 rounded-xl text-sm disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save session →"}
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="border border-[#D8D5D1] bg-white px-6 py-3 rounded-xl text-sm"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
