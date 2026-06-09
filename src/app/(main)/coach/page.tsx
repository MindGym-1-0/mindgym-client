"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { getCoachHome, getInterviews } from "../../../lib/coach/api";
import type { CoachHomeResponse, RecommendedSession } from "../../../lib/coach/types";
import type { Interview } from "../../../lib/coach/api";
import { writeSetup } from "../../../lib/session/store";

const FALLBACK_SESSIONS: RecommendedSession[] = [
  { title: "Pre-interview calm reset", duration_mins: 8, focus: "Breathing + visualization", session_type: "interview_tomorrow" },
  { title: "Confidence builder", duration_mins: 10, focus: "Grounding + anchor", session_type: "general_reset" },
  { title: "Think clearly under pressure", duration_mins: 10, focus: "Focus + mental clarity", session_type: "general_reset" },
];

const FALLBACK_INSIGHTS = [
  "Strongest area: motivation and persistence",
  "Growth area: thinking clearly under pressure",
  "Pattern: anxiety spikes the night before interviews",
  "Morning sessions produce higher confidence lifts",
];

const INSIGHT_COLORS = ["#0D7C66", "#E59B00", "#C0392B", "#8E44AD"];

const SESSION_EMOJIS: Record<string, string> = {
  interview_tomorrow: "🧘",
  general_reset: "💪",
  recruiter_call: "📞",
  networking: "🤝",
  salary_negotiation: "💼",
  rejection_recovery: "💔",
  restarting_search: "🧠",
  pre_interview_calm_reset: "🧘",
  confidence_builder: "💪",
  think_clearly_under_pressure: "🧠",
};

function getSessionEmoji(session_type: string): string {
  return SESSION_EMOJIS[session_type] ?? "✨";
}

function formatInterviewDate(raw: string): string {
  try {
    const d = new Date(raw);
    const now = new Date();
    const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 0) return `Today · ${time}`;
    if (diffDays === 1) return `Tomorrow · ${time}`;
    return `${d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
  } catch {
    return raw;
  }
}

const FALLBACK_INTERVIEW_GREETING = "Your interview is coming up soon. Let's make sure you go in feeling clear, not just prepared. Which session would you like to start with?";
const FALLBACK_GENERAL_GREETING = "You don't have any upcoming interviews right now. You can still do a general reset session today and stay mentally ready.";
const FALLBACK_SUGGESTION = {
  text: "A 5-min breathing session tonight at 9 PM. The night before has the highest impact on next-day composure.",
};

export default function CoachPage() {
  const name = useUserName();
  const router = useRouter();

  const [coachHome, setCoachHome] = useState<CoachHomeResponse | null>(null);
  const [upcomingInterview, setUpcomingInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [homeData, interviewsData] = await Promise.allSettled([
          getCoachHome(),
          getInterviews(),
        ]);

        if (!isActive) return;

        if (homeData.status === "fulfilled") {
          setCoachHome(homeData.value);
        } else {
          setError("We couldn't load coach updates right now. Showing your latest saved guidance.");
        }

        if (interviewsData.status === "fulfilled") {
          setUpcomingInterview(interviewsData.value.upcoming?.[0] ?? null);
        }
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    }

    load();
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

  const hasUpcomingInterview = Boolean(upcomingInterview);
  const mayaGreeting = coachHome?.maya_greeting
    ? `${coachHome.maya_greeting} Which session would you like to start with?`
    : `Hi ${name} 👋 — ${hasUpcomingInterview ? FALLBACK_INTERVIEW_GREETING : FALLBACK_GENERAL_GREETING}`;
  const suggestionText = coachHome?.maya_suggests?.text || FALLBACK_SUGGESTION.text;

  function handleStartSession() {
    if (upcomingInterview) {
      writeSetup({
        preparation_for: "interview_tomorrow",
        company: upcomingInterview.company,
        role: upcomingInterview.role,
      });
    }
    router.push("/sessions/setup/emotions");
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1D1D1D]">Maya • your coach</h1>
        <p className="mt-1 text-gray-500">
          {isLoading ? "Loading your coach updates..." : "Active · Session 1"}
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] px-4 py-3 text-sm text-[#8B5E00]">{error}</div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D7C66] font-medium text-white">
              M
            </div>
            <div>
              <p className="leading-relaxed text-gray-700">{mayaGreeting}</p>
              <div className="mt-4 rounded-xl border border-[#F2C879] bg-[#FFF5E6] px-4 py-2 text-sm text-[#8B5E00]">
                Friendly mode: warm and encouraging tone throughout your session
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {upcomingInterview ? (
            <>
              <p className="text-sm font-medium text-[#E59B00]">
                {formatInterviewDate(upcomingInterview.interview_date)}
                {upcomingInterview.event_type ? ` · ${upcomingInterview.event_type.replace(/_/g, " ")}` : ""}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{upcomingInterview.role}</h2>
              <p className="mt-0.5 text-sm font-medium text-gray-500">{upcomingInterview.company}</p>
              <p className="mt-1 text-sm text-gray-400">You mentioned feeling anxious about thinking clearly on the spot.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#E59B00]">No upcoming interviews</p>
              <h2 className="mt-2 text-lg font-semibold">Add an interview to get personalized prep</h2>
              <p className="mt-1 text-sm text-gray-400">You can still do a general reset session today.</p>
            </>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleStartSession}
              className="rounded-lg bg-[#0D7C66] px-4 py-2 text-sm text-white hover:bg-[#095c4c]"
            >
              {upcomingInterview ? "Start pre-interview session →" : "Start general reset session →"}
            </button>
            <button
              onClick={() => router.push(upcomingInterview ? `/coach/checklist?interview_id=${upcomingInterview.id}` : "/coach/interviews")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              {upcomingInterview ? "View checklist" : "Add interview"}
            </button>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recommended Sessions</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {recommendedSessions.map((session, index) => (
          <div key={`${session.session_type}-${index}`} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">{getSessionEmoji(session.session_type)}</div>
            <h3 className="mt-4 text-lg font-semibold">{session.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {session.duration_mins} min · {session.focus} · Maya guided
            </p>
            <button
              onClick={handleStartSession}
              className="mt-6 rounded-lg bg-[#0D7C66] px-4 py-2 text-white hover:bg-[#095c4c]"
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
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: INSIGHT_COLORS[index % INSIGHT_COLORS.length] }}
            />
            {tip}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#8DD8C4] bg-[#DFF5EF] p-4 text-sm text-[#065F46]">
        Maya suggests: {suggestionText}
      </div>
    </div>
  );
}
