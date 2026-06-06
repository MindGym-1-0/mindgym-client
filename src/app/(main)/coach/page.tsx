// src/app/(main)/coach/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";

interface Session {
  title: string;
  subtitle: string;
  emoji: string;
}

const sessions: Session[] = [
  {
    title: "Pre-interview calm reset",
    subtitle: "8 min • Breathing + visualization",
    emoji: "🧘",
  },
  {
    title: "Confidence builder",
    subtitle: "10 min • Maya-guided",
    emoji: "💔",
  },
  {
    title: "Think clearly under pressure",
    subtitle: "10 min • Focus + mental clarity",
    emoji: "🧠",
  },
];

export default function CoachPage() {
  const name = useUserName();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-4 md:p-8">

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-[#1D1D1D]">
          Maya • your coach
        </h1>
        <p className="text-gray-500 mt-1">
          Active • Session 1
        </p>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">

        {/* Maya Message */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#0D7C66] text-white flex items-center justify-center">
              M
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Hi {name} 👋 — your final interview is tomorrow.
                I know it feels close. Let's make sure you go
                in feeling clear, not just prepared.
              </p>
              <div className="mt-4 bg-[#FFF5E6] border border-[#F2C879] rounded-xl px-4 py-3 text-sm text-[#8B5E00]">
                Friendly mode: warm and encouraging throughout
                your session.
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Interview */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
          <p className="text-sm text-[#E59B00] font-medium">
            Tomorrow • 10:00 AM
          </p>
          <h2 className="text-lg font-semibold mt-2">
            Product Designer
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            You mentioned feeling anxious about thinking
            clearly on the spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => router.push("/coach/interview-checkin")}
              className="w-full sm:w-auto min-h-[44px] bg-[#0D7C66] text-white px-4 py-2 rounded-lg hover:bg-[#095c4c] transition-colors"
            >
              Start pre-interview session
            </button>
            <button
              onClick={() => router.push("/coach/checklist")}
              className="w-full sm:w-auto min-h-[44px] border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View checklist
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Sessions */}
      <h2 className="text-lg font-semibold mb-4">
        Recommended Sessions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
        {sessions.map((session: Session, index: number) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 md:p-6 shadow-sm"
          >
            <div className="text-4xl">{session.emoji}</div>
            <h3 className="mt-4 font-semibold text-lg">{session.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{session.subtitle}</p>
            <button className="mt-6 w-full min-h-[44px] bg-[#0D7C66] text-white px-4 py-2 rounded-lg hover:bg-[#095c4c] transition-colors">
              Start
            </button>
          </div>
        ))}
      </div>

      {/* Recommended Today */}
      <h2 className="text-lg font-semibold mb-4">
        Recommended Today
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          "Strongest users maintain persistence",
          "Growth anxiety thinking clearly under pressure",
          "Patterns: anxiety spikes the night before interviews",
          "Morning sessions produce highest confidence lifts",
        ].map((tip: string, i: number) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-700"
          >
            • {tip}
          </div>
        ))}
      </div>

      {/* Maya Suggestion */}
      <div className="bg-[#DFF5EF] border border-[#8DD8C4] rounded-xl p-4 text-sm text-[#065F46]">
        Maya suggests: A 5-minute breathing session tonight at 9 PM.
      </div>
    </div>
  );
}
