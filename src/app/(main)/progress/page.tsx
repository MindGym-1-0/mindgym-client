"use client";

import { useEffect, useState } from "react";
import { useUserName } from "@/hooks/useUserName";
import { getSessionHistory, type SessionHistoryItem } from "@/lib/session/api";

type Range = "week" | "month" | "all";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
const BAR_MAX_PX = 64;

function filterByRange(sessions: SessionHistoryItem[], range: Range): SessionHistoryItem[] {
  if (range === "all") return sessions;
  const now = new Date();
  const cutoff = new Date(now);
  if (range === "week") cutoff.setDate(now.getDate() - 7);
  if (range === "month") cutoff.setDate(now.getDate() - 30);
  return sessions.filter((s) => new Date(s.created_at) >= cutoff);
}

function buildWeeklyBars(sessions: SessionHistoryItem[]): number[] {
  const counts = new Array<number>(7).fill(0);
  const now = new Date();
  sessions.forEach((s) => {
    const diffDays = Math.floor(
      (now.getTime() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 7) counts[6 - diffDays]++;
  });
  return counts;
}

function computeAvgLift(sessions: SessionHistoryItem[]): string {
  const completed = sessions.filter((s) => s.anxiety_level_delta !== null);
  if (completed.length === 0) return "—";
  const avg =
    completed.reduce((sum, s) => sum + (s.anxiety_level_delta ?? 0), 0) /
    completed.length;
  return avg >= 0 ? `+${avg.toFixed(1)}` : avg.toFixed(1);
}

export default function ProgressPage() {
  const name = useUserName();
  const [allSessions, setAllSessions] = useState<SessionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("week");

  useEffect(() => {
    getSessionHistory()
      .then(setAllSessions)
      .catch((err) => console.error("Failed to load session history:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterByRange(allSessions, range);
  const sessionCount = filtered.length;
  const avgLift = computeAvgLift(filtered);
  const weeklyBars = buildWeeklyBars(allSessions);
  const barMax = Math.max(...weeklyBars, 1);

  const RANGES: { label: string; value: Range }[] = [
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
    { label: "All time", value: "all" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F4] px-10 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Overview • Daily Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold">Progress</h1>
          <p className="mt-2 text-sm text-gray-500">{name} • — day streak</p>
        </div>

        <div className="flex gap-3">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                range === r.value
                  ? "border border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white text-gray-600"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-4xl font-semibold text-[#0C6B58]">—</h2>
          <p className="mt-3 text-sm text-gray-500">AVG CONFIDENCE</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-4xl font-semibold text-[#0C6B58]">
            {loading ? "—" : sessionCount}
          </h2>
          <p className="mt-3 text-sm text-gray-500">SESSIONS DONE</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-4xl font-semibold text-orange-500">—</h2>
          <p className="mt-3 text-sm text-gray-500">DAY STREAK 🔥</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-4xl font-semibold text-[#0C6B58]">
            {loading ? "—" : avgLift}
          </h2>
          <p className="mt-3 text-sm text-gray-500">AVG LIFT / SESSION</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500">
            SESSIONS THIS WEEK
          </h2>

          <div className="mt-10 flex items-end gap-4" style={{ height: BAR_MAX_PX }}>
            {weeklyBars.map((count, index) => {
              const height =
                count === 0
                  ? 4
                  : Math.max(8, Math.round((count / barMax) * BAR_MAX_PX));
              return (
                <div
                  key={index}
                  className={`w-10 rounded-t-full ${count === 0 ? "bg-gray-200" : "bg-[#0C6B58]"}`}
                  style={{ height }}
                />
              );
            })}
          </div>

          <div className="mt-3 flex justify-between px-2 text-xs text-gray-500">
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500">
            EMOTIONAL STATES TREND
          </h2>
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl bg-[#F6F6F4]">
            <p className="text-sm text-gray-400">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
