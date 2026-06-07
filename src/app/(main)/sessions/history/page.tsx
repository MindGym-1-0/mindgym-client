"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionHistory, getSessionDetail, type SessionHistoryItem } from "@/lib/session/api";
import { writeActive } from "@/lib/session/store";

const PREP_LABELS: Record<string, string> = {
  interview_tomorrow: "Interview Prep",
  recruiter_call: "Recruiter Call",
  networking: "Networking",
  salary_negotiation: "Salary Negotiation",
  rejection_recovery: "Rejection Recovery",
  restarting_search: "Restarting Search",
  general_reset: "Calm Reset",
};

const PREP_EMOJIS: Record<string, string> = {
  interview_tomorrow: "💼",
  recruiter_call: "📞",
  networking: "🤝",
  salary_negotiation: "💰",
  rejection_recovery: "💔",
  restarting_search: "🔄",
  general_reset: "😌",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function LiftBadge({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  const lift = -delta;
  const isPositive = lift > 0;
  return (
    <div
      className={`px-3 py-1 rounded-full text-sm ${
        isPositive
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {isPositive ? `+${lift} lift` : `${lift} lift`}
    </div>
  );
}

export default function SessionHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [replayingId, setReplayingId] = useState<string | null>(null);

  async function handleReplay(sessionId: string, anxietyLevelBefore: number) {
    if (replayingId) return;
    setReplayingId(sessionId);
    try {
      const detail = await getSessionDetail(sessionId);
      writeActive({
        session_id: detail.id,
        script: detail.script,
        anxiety_level_before: anxietyLevelBefore,
      });
      router.push("/sessions/active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
      setReplayingId(null);
    }
  }

  useEffect(() => {
    getSessionHistory()
      .then(setSessions)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load sessions");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <h1 className="text-4xl font-semibold mb-2">Session history</h1>
      <p className="text-gray-500 mb-8">Your coaching sessions over time.</p>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          Loading…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && sessions.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          No sessions yet. Complete your first session to see it here.
        </div>
      )}

      {!isLoading && !error && sessions.length > 0 && (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl border p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {PREP_EMOJIS[session.preparation_for] ?? "🧠"}
                </div>
                <div>
                  <h2 className="font-semibold">
                    {PREP_LABELS[session.preparation_for] ?? session.preparation_for}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {session.completed_at ? formatDate(session.completed_at) : "In progress"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <LiftBadge delta={session.anxiety_level_delta} />
                <button
                  onClick={() => handleReplay(session.id, session.anxiety_level_before)}
                  disabled={replayingId === session.id}
                  className="bg-[#0C6B58] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {replayingId === session.id ? "Loading…" : "Replay"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
