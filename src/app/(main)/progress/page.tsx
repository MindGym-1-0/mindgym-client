"use client";

import { useEffect, useState } from "react";
import { useUserName } from "@/hooks/useUserName";
import { getProgress, ProgressResponse } from "@/lib/progress/api";

type Period = "week" | "month" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  week: "This week",
  month: "This month",
  all: "All time",
};

const PERIOD_PARAM: Record<Period, "week" | "month" | "all"> = {
  week: "week",
  month: "month",
  all: "all",
};

export default function ProgressPage() {
  const name = useUserName();
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProgress(PERIOD_PARAM[period])
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [period]);

  const avgLift = data?.avg_lift_per_session ?? 0;
  const sessionsDone = data?.sessions_done ?? 0;
  const dayStreak = data?.day_streak ?? 0;

  const bars = Array.from({ length: 7 }, (_, i) => {
    const filled = Math.min(sessionsDone, 7);
    const baseHeights = ["h-4", "h-6", "h-8", "h-10", "h-11", "h-14", "h-16"];
    return { height: baseHeights[i], active: i < filled };
  });

  return (
    <div className="min-h-screen bg-[#F6F6F4] px-4 py-6 md:px-10 md:py-8">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">Overview • Daily Dashboard</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold">Progress</h1>
          <p className="mt-2 text-sm text-gray-500">
            {name}
            {dayStreak > 0 && ` • ${dayStreak}-day streak 🔥`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["week", "month", "all"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm border transition-colors ${
                period === p
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          Failed to load progress data. Please try again.
        </div>
      )}

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          {loading ? (
            <div className="h-10 w-16 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0C6B58]">
              {sessionsDone}
            </h2>
          )}
          <p className="mt-3 text-sm text-gray-500">SESSIONS DONE</p>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          {loading ? (
            <div className="h-10 w-16 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
            <h2 className="text-3xl md:text-4xl font-semibold text-orange-500">
              {dayStreak}
            </h2>
          )}
          <p className="mt-3 text-sm text-gray-500">DAY STREAK 🔥</p>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          {loading ? (
            <div className="h-10 w-16 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0C6B58]">
              {avgLift > 0 ? `+${avgLift}` : avgLift}
            </h2>
          )}
          <p className="mt-3 text-sm text-gray-500">AVG ANXIETY LIFT / SESSION</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 gap-6">

        {/* Sessions bar chart */}
        <div className="rounded-3xl bg-white p-5 md:p-6 shadow-sm overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500">
            SESSIONS THIS WEEK
          </h2>

          <div className="mt-10 flex items-end justify-between gap-2 md:gap-4 h-48">
            {bars.map((bar, index) => (
              <div
                key={index}
                className={`flex-1 max-w-[64px] rounded-t-xl transition-all duration-500 ${bar.height}`}
                style={{
                  background: bar.active
                    ? "linear-gradient(180deg, #0C6B58 0%, #14A87E 100%)"
                    : "#E8ECEA",
                  opacity: bar.active ? 0.4 + (0.6 * (index + 1)) / 7 : 1,
                }}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-between text-[10px] sm:text-xs text-gray-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}