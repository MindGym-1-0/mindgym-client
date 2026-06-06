// src/app/(main)/progress/page.tsx

"use client";

import { useUserName } from "@/hooks/useUserName";

const weeklyBars = [
  "h-4",
  "h-6",
  "h-8",
  "h-10",
  "h-11",
  "h-14",
  "h-16",
];

const emotionalStats = [
  {
    label: "Confidence",
    value: "72%",
    width: "72%",
    color: "bg-[#0C6B58]",
  },
  {
    label: "Clarity",
    value: "65%",
    width: "65%",
    color: "bg-orange-500",
  },
  {
    label: "Calmness",
    value: "55%",
    width: "55%",
    color: "bg-blue-500",
  },
  {
    label: "Focus",
    value: "65%",
    width: "65%",
    color: "bg-emerald-600",
  },
];

export default function ProgressPage() {
  const name = useUserName();

  return (
    <div className="min-h-screen bg-[#F6F6F4] px-4 py-6 md:px-10 md:py-8">
      
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        <div>
          <p className="text-sm text-gray-500">
            Overview • Daily Dashboard
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl font-semibold">
            Progress
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {name} • 3-day streak 🔥
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button className="min-h-[44px] rounded-full border border-[#0C6B58] bg-[#DDF4EE] px-4 py-2 text-sm text-[#0C6B58]">
            This week
          </button>

          <button className="min-h-[44px] rounded-full bg-white px-4 py-2 text-sm text-gray-600 border border-gray-200">
            This month
          </button>

          <button className="min-h-[44px] rounded-full bg-white px-4 py-2 text-sm text-gray-600 border border-gray-200">
            All time
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0C6B58]">
            72%
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            AVG CONFIDENCE
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0C6B58]">
            6
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            SESSIONS DONE
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-semibold text-orange-500">
            3
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            DAY STREAK 🔥
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0C6B58]">
            +4.2
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            AVG LIFT / SESSION
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        
        {/* Confidence Graph */}
        <div className="rounded-3xl bg-white p-5 md:p-6 shadow-sm overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500">
            CONFIDENCE OVER TIME
          </h2>

          <div className="mt-10 flex items-end justify-between gap-2">
            {weeklyBars.map((height, index) => (
              <div
                key={index}
                className={`flex-1 max-w-[40px] rounded-t-full bg-[#0C6B58] ${height} ${
                  index < 2
                    ? "opacity-20"
                    : index < 4
                    ? "opacity-40"
                    : index < 5
                    ? "opacity-60"
                    : ""
                }`}
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

        {/* Emotional Trends */}
        <div className="rounded-3xl bg-white p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500">
            EMOTIONAL STATES TREND
          </h2>

          <div className="mt-8 space-y-6">
            {emotionalStats.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {item.label}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.value}
                  </p>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-3 rounded-full ${item.color}`}
                    style={{
                      width: item.width,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#0C6B58] bg-[#EAF8F4] p-4">
            <p className="text-sm text-[#0C6B58] leading-relaxed">
              Key insight: Calmness is your biggest
              growth area. Two more sessions should
              push it past 70%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}