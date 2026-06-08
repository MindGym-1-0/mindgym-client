// src/app/(main)/sessions/page.tsx

"use client";

import Link from "next/link";

const sessions = [
  {
    title: "Calm Reset",
    subtitle: "5 min • Breathing reset",
    emoji: "🫁",
  },
  {
    title: "Confidence Builder",
    subtitle: "10 min • Maya guided",
    emoji: "💪",
  },
  {
    title: "Think Clearly Under Pressure",
    subtitle: "10 min • Focus + calm",
    emoji: "🧠",
  },
];

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F4] p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500">
            Overview {" > "} Daily Dashboard
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold mt-2">
            Sessions
          </h1>
        </div>

        <Link
          href="/sessions/setup/emotions"
          className="w-full md:w-auto min-h-[44px] flex items-center justify-center bg-[#0C6B58] text-white px-5 py-3 rounded-xl hover:bg-[#095545] transition-colors"
        >
          Start session →
        </Link>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {sessions.map((session) => (
          <div
            key={session.title}
            className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200 shadow-sm"
          >
            <div className="text-5xl mb-4">
              {session.emoji}
            </div>

            <h2 className="text-xl font-semibold">
              {session.title}
            </h2>

            <p className="text-gray-500 mt-2">
              {session.subtitle}
            </p>

            <button className="mt-6 w-full min-h-[44px] bg-[#0C6B58] text-white px-4 py-2 rounded-lg hover:bg-[#095545] transition-colors">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}