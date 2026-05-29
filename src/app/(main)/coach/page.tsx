"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { getCoachHome } from "../../../lib/coach/api";
import type { CoachHomeResponse, RecommendedSession } from "../../../lib/coach/types";

const FALLBACK_SESSIONS: RecommendedSession[] = [
  {
    title: "Pre-interview calm reset",
    duration_mins: 8,
    focus: "Breathing + visualization",
    session_type: "pre_interview_calm_reset"
  },
  {
    title: "Confidence builder",
    duration_mins: 10,
    focus: "Grounding + anchor",
    session_type: "confidence_builder"
  },
  {
    title: "Think clearly under pressure",
    duration_mins: 10,
    focus: "Focus + mental clarity",
    session_type: "think_clearly_under_pressure"
  }
];

const FALLBACK_INSIGHTS = [
  "Strongest area: motivation and persistence",
  "Growth area: thinking clearly under pressure",
  "Pattern: anxiety spikes the night before interviews",
  "Morning sessions produce higher confidence lifts"
];

const FALLBACK_GREETING =
  "Your final interview is tomorrow. Let's make sure you go in feeling clear, not just prepared.";

const FALLBACK_SUGGESTION = {
  text: "A short breathing session tonight can improve tomorrow's composure.",
  time_suggestion: "9:00 PM"
};

export default function CoachPage() {
  const name = useUserName();
  const router = useRouter();

  const [coachHome, setCoachHome] = useState<CoachHomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCoachHome() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCoachHome();
        if (!isActive) return;
        setCoachHome(data);
      } catch {
        if (!isActive) return;
        setError("We couldn't load coach updates right now. Showing your latest saved guidance.");
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    }

    loadCoachHome();

    return () => {
      isActive = false;
    };
  }, []);

  const recommendedSessions = useMemo(() => {
    if (coachHome?.recommended_sessions?.length) return coachHome.recommended_sessions;
    return FALLBACK_SESSIONS;
  }, [coachHome]);

  const recommendedToday = useMemo(() => {
    if (coachHome?.recommended_today?.length) return coachHome.recommended_today;
    return FALLBACK_INSIGHTS;
  }, [coachHome]);

  const mayaGreeting = coachHome?.maya_greeting || `Hi ${name} - ${FALLBACK_GREETING}`;
  const suggestionText = coachHome?.maya_suggests?.text || FALLBACK_SUGGESTION.text;
  const suggestionTime = coachHome?.maya_suggests?.time_suggestion || FALLBACK_SUGGESTION.time_suggestion;

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1D1D1D]">Maya - your coach</h1>
        <p className="mt-1 text-gray-500">{isLoading ? "Loading your coach updates..." : "Active - Session 1"}</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] px-4 py-3 text-sm text-[#8B5E00]">{error}</div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D7C66] text-white">M</div>

            <div>
              <p className="leading-relaxed text-gray-700">{mayaGreeting}</p>

              <div className="mt-4 rounded-xl border border-[#F2C879] bg-[#FFF5E6] px-4 py-2 text-sm text-[#8B5E00]">
                Friendly mode: warm and encouraging tone throughout your session
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#E59B00]">Tomorrow - 10:00 AM</p>
          <h2 className="mt-2 text-lg font-semibold">Product Designer</h2>
          <p className="mt-1 text-sm text-gray-500">You mentioned feeling anxious about thinking clearly on the spot.</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push("/coach/interview-checkin")}
              className="rounded-lg bg-[#0D7C66] px-4 py-2 text-white hover:bg-[#095c4c]"
            >
              Start pre-interview session
            </button>

            <button
              onClick={() => router.push("/coach/checklist")}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              View checklist
            </button>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recommended Sessions</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {recommendedSessions.map((session, index) => (
          <div key={`${session.session_type}-${index}`} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">*</div>
            <h3 className="mt-4 text-lg font-semibold">{session.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {session.duration_mins} min - {session.focus}
            </p>
            <button
              className="mt-6 rounded-lg bg-[#0D7C66] px-4 py-2 text-white"
              data-session-type={session.session_type}
            >
              Start
            </button>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recommended Today</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {recommendedToday.map((tip, index) => (
          <div key={`${tip}-${index}`} className="rounded-xl bg-white p-4 text-sm text-gray-700 shadow-sm">
            * {tip}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#8DD8C4] bg-[#DFF5EF] p-4 text-sm text-[#065F46]">
        Maya suggests: {suggestionText}
        {suggestionTime ? ` (${suggestionTime})` : ""}
      </div>
    </div>
  );
}
