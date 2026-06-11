"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { getGreeting } from "@/lib/greeting";
import { getInterviews, type InterviewItem } from "@/lib/interviews/api";
import { getSessionHistory } from "@/lib/session/api";
import { writeSetup, clearSetup } from "@/lib/session/store";
import { getInsights, getUserProfile, type InsightsResponse, type UserProfile } from "@/lib/insights/api";
import { getApplications, toFunnelCounts, type FunnelCounts } from "@/lib/applications/api";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }) +
    " — " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

function formatInterviewTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today — ${timeStr}`;
  if (isTomorrow) return `Tomorrow — ${timeStr}`;
  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }) + ` — ${timeStr}`
  );
}

// ─── sub-components ─────────────────────────────────────────────────────────

/** Mood emoji row in the top-right */
function MoodTracker() {
  const moods = ["😊", "😄", "😐", "😟", "😞"];
  const [selected, setSelected] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      await supabase.auth.signOut();

      // Clear backend auth cookies used by middleware
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs text-gray-500">
        Mood today
      </span>

      {moods.map((emoji, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all ${
            selected === i
              ? "ring-2 ring-[#0C6B58] bg-[#0C6B58]/10"
              : "hover:bg-gray-100"
          }`}
        >
          {emoji}
        </button>
      ))}

      <button
        onClick={handleLogout}
        className="ml-2 rounded-lg bg-[#1A1A1A] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black"
      >
        Log Out
      </button>
    </div>
  );
}

/** Readiness dots (e.g. ●●●●○○○○○○) */
function ReadinessDots({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${
            i < value ? "bg-white" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}

/** Circular progress ring for today's focus */
function ProgressRing({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? done / total : 0;
  const offset = circ * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#0C6B58"
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
        <text
          x="55"
          y="51"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#1A1A1A]"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          {done}/{total}
        </text>
        <text
          x="55"
          y="68"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 10, fill: "#6B7280" }}
        >
          done today
        </text>
      </svg>
    </div>
  );
}

/** Mini bar chart for confidence this week */
function ConfidenceChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
  // Hard-coded confidence data (backend not available yet)
  const values = [40, 55, 50, 62, 68, 72, 80];
  const max = Math.max(...values);

  return (
    <div>
      <p className="text-sm font-medium text-[#1A1A1A] mb-3">Confidence this week</p>
      <div className="flex items-end gap-2 h-24">
        {days.map((day, i) => {
          const heightPct = (values[i] / max) * 100;
          const isToday = day === "Today";
          return (
            <div key={day} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full relative" style={{ height: "72px" }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-md transition-all ${
                    isToday ? "bg-[#0C6B58]" : "bg-[#D1FAE5]"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className={`text-[10px] ${isToday ? "text-[#0C6B58] font-semibold" : "text-gray-400"}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const name = useUserName();
  const router = useRouter();
  const [dateStr, setDateStr] = useState("");
  const [nextInterview, setNextInterview] = useState<InterviewItem | null>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewItem[]>([]);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [interviewCount, setInterviewCount] = useState<number | null>(null);
  const [lastSession, setLastSession] = useState<{ label: string; score: string; delta: string } | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [funnelCounts, setFunnelCounts] = useState<FunnelCounts | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  function handlePrepareWithMaya(interview: InterviewItem) {
    clearSetup();
    writeSetup({
      preparation_for: "interview_tomorrow",
      company: interview.company,
      role: interview.role,
    });
    router.push("/sessions/setup/emotions");
  }

  function handleStartSession() {
    clearSetup();
    router.push("/sessions/setup/emotions");
  }

  useEffect(() => {
    setDateStr(formatDate(new Date()));
  }, []);

  useEffect(() => {
    getInterviews()
      .then(({ upcoming }) => {
        setNextInterview(upcoming[0] ?? null);
        setUpcomingInterviews(upcoming);
        setInterviewCount(upcoming.length);
      })
      .catch((err) => console.error("Failed to load interviews:", err));

    getSessionHistory()
      .then((sessions) => {
        setSessionCount(sessions.length);
        if (sessions.length > 0) {
          const s = sessions[sessions.length - 1];

    setLastSession({
  label:
    s.preparation_for
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Calm Reset – Pre-Interview",

  score: `${
    s.anxiety_level_after ??
    s.anxiety_level_before
  }/10`,

  delta:
    s.anxiety_level_delta !== null
      ? `${s.anxiety_level_delta > 0 ? "+" : ""}${
          s.anxiety_level_delta
        }`
      : "—",
     });
        }
      })
      .catch((err) => console.error("Failed to load session history:", err));

    getInsights()
      .then((data) => setInsights(data))
      .catch((err) => console.error("Failed to load insights:", err));

    getApplications()
      .then((apps) => setFunnelCounts(toFunnelCounts(apps)))
      .catch((err) => console.error("Failed to load applications:", err));

    getUserProfile()
      .then((data) => setUserProfile(data))
      .catch((err) => console.error("Failed to load user profile:", err));
  }, []);

  // Hard-coded today's focus tasks (Maya data; swap with API when ready)
  const focusTasks = [
    {
      id: 1,
      title: "Loop how you're feeling this morning",
      subtitle: "One tap — a line in your journal",
      tag: null,
      done: true,
    },
    {
      id: 2,
      title: "Prepare Your Mental Game",
      subtitle: "Build clarity and confidence before pressure hits",
      tag: nextInterview ? `For ${nextInterview.company}` : null,
      done: false,
    },
    {
      id: 3,
      title: "Do a 5-minute calm reset before bed",
      subtitle: "Guided breathing so tomorrow starts grounded",
      tag: "Daily",
      done: false,
    },
  ];
  const doneCount = focusTasks.filter((t) => t.done).length;

  // Use tracked app counts if available, otherwise fall back to onboarding self-reported numbers.
  const hasTrackedApps = funnelCounts !== null && Object.values(funnelCounts).some((v) => v > 0);
  const displayFunnel = hasTrackedApps
    ? funnelCounts!
    : {
        applied: userProfile?.applications_sent_max ?? userProfile?.applications_sent_min ?? 0,
        screening: userProfile?.recruiter_contacts ?? 0,
        final: userProfile?.first_round_interviews ?? 0,
        offer: userProfile?.offers ?? 0,
      };

  // Second upcoming interview (for "Next up" card)
  const nextUpInterview = upcomingInterviews[1] ?? null;

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-[#1A1A1A]">
            {getGreeting(name)} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-400">{dateStr}</p>
        </div>
        <MoodTracker />
      </div>

      {/* ── Interview banner + Next up ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Main interview card (2/3 width) */}
        <div className="col-span-2 rounded-2xl bg-[#0C6B58] p-6 text-white relative overflow-hidden">
          {nextInterview ? (
            <>
              <p className="text-xs opacity-70 mb-1">
                {nextInterview.event_type} · {formatInterviewTime(nextInterview.interview_date)}
              </p>
              <h2 className="text-3xl font-semibold leading-tight max-w-xs">
                {nextInterview.role} @{" "}
                <span className="block">{nextInterview.company}</span>
              </h2>
              {nextInterview.notes && (
                <p className="mt-1 text-xs opacity-60">{nextInterview.notes}</p>
              )}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handlePrepareWithMaya(nextInterview)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  Prepare with Maya →
                </button>
                <button className="rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                  View checklist
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs opacity-70 mb-1">No upcoming interviews</p>
              <h2 className="text-3xl font-semibold leading-tight">
                Ready when you are.
              </h2>
              <div className="mt-5">
                <button
                  onClick={handleStartSession}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  Start a session →
                </button>
              </div>
            </>
          )}

          {/* Readiness score — hard-coded until backend provides it */}
          {nextInterview && (
            <div className="absolute top-6 right-6 text-right">
              <p className="text-xs opacity-60">Readiness</p>
              <p className="text-4xl font-bold">8</p>
              <p className="text-xs opacity-60">out of 10</p>
              <ReadinessDots value={8} />
            </div>
          )}
        </div>

        {/* Next up card (1/3 width) */}
        <div className="rounded-2xl bg-white p-5 shadow-sm flex flex-col justify-between">
          {nextUpInterview ? (
            <>
              <div>
                <p className="text-xs text-gray-400 mb-1">Next up — next week</p>
                <p className="text-xs text-gray-500">
                  {formatInterviewTime(nextUpInterview.interview_date)}
                </p>
                <h3 className="mt-2 text-base font-semibold text-[#1A1A1A] leading-snug">
                  {nextUpInterview.role} @ {nextUpInterview.company}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  0 days away · 0 prep sessions
                </p>
              </div>
              <button
                onClick={() => handlePrepareWithMaya(nextUpInterview)}
                className="mt-4 w-full rounded-xl bg-[#F3F4F6] px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-200 transition-colors"
              >
                Start prep →
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p className="text-sm text-gray-400">No other interviews scheduled</p>
              <button
                onClick={() => router.push("/coach/interviews/add")}
                className="mt-2 rounded-xl bg-[#F3F4F6] px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-200 transition-colors"
              >
                Add interview →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Today's focus + progress ring ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Focus tasks (2/3) */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0C6B58] text-white text-xs flex items-center justify-center font-semibold">
                M
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Today's focus</p>
                <p className="text-xs text-gray-400">from Maya</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 rounded-full bg-[#1A1A1A] text-white font-medium">
                Today
              </button>
              <button className="px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">
                This week
              </button>
            </div>
          </div>

          {/* Maya message */}
          {nextInterview && (
            <p className="text-sm text-gray-600 mb-4">
              Your Google final is tomorrow — today is about staying steady, not cramming. Three small things and you're set.
            </p>
          )}

          {/* Tasks */}
          <div className="space-y-3">
            {focusTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 rounded-xl p-3 ${
                  task.done ? "bg-[#F0FDF9]" : "bg-[#F9FAFB]"
                }`}
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    task.done
                      ? "bg-[#0C6B58] border-[#0C6B58]"
                      : "border-gray-300"
                  }`}
                >
                  {task.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.done ? "text-gray-400 line-through" : "text-[#1A1A1A]"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{task.subtitle}</p>
                </div>
                {task.tag && (
                  <span className="text-xs text-[#0C6B58] bg-[#D1FAE5] rounded-full px-2 py-0.5 flex-shrink-0">
                    {task.tag}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-400">↻ Resets each morning</p>
        </div>

        {/* Progress ring (1/3) */}
        <div className="rounded-2xl bg-[#F9FAFB] p-6 shadow-sm flex flex-col items-center justify-between">
          <ProgressRing done={doneCount} total={focusTasks.length} />
          <p className="mt-3 text-xs text-center text-gray-500">
            Finish all three to keep your streak alive.
          </p>
          <button
            onClick={() => router.push("/sessions")}
            className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
          >
            View Full Plan →
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-4xl font-bold text-[#0C6B58]">{sessionCount ?? "—"}</h3>
          <p className="mt-1 text-xs text-gray-500">Sessions done</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-4xl font-bold text-[#F59E0B] flex items-center gap-1">
            1 <span className="text-xl">🔥</span>
          </h3>
          <p className="mt-1 text-xs text-gray-500">Day streak</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          {/* Confidence hard-coded — backend not wired yet */}
          <h3 className="text-4xl font-bold text-[#0C6B58]">12%</h3>
          <p className="mt-1 text-xs text-gray-500">Confidence lift</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-4xl font-bold text-[#1A1A1A]">{interviewCount ?? "—"}</h3>
          <p className="mt-1 text-xs text-gray-500">Interviews set</p>
        </div>
      </div>

      {/* ── What's getting in your way ── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">What's getting in your way</h2>
          {(userProfile?.mindset_gap || userProfile?.hunting_gap) && (
            <span className="text-xs bg-[#F3F4F6] rounded-full px-3 py-1 text-gray-500">
              {[userProfile.mindset_gap, userProfile.hunting_gap].filter(Boolean).length} gaps tracked
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Maya tracks two kinds of gaps — what's happening in your{" "}
          <span className="text-[#EF4444] font-medium">mindset</span> and in your{" "}
          <span className="text-[#0C6B58] font-medium">hiring funnel</span> — and works them together, not in isolation.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Mindset card */}
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#EF4444] bg-red-50 rounded-full px-2 py-0.5">
                Mindset
              </span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">
              {userProfile?.mindset_gap ?? insights?.top_insights[0]?.text ?? "Analysing your mindset…"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {userProfile?.mindset_gap_detail ?? insights?.top_insights[0]?.detail ?? "Maya is reviewing your patterns."}
            </p>
            {insights?.top_insights[1] && (
              <p className="text-xs text-gray-400">
                <span className="text-[#0C6B58]">{insights.top_insights[1].text}</span>
                {" — "}
                {insights.top_insights[1].detail}
              </p>
            )}
          </div>

          {/* Hiring funnel card */}
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#0C6B58] bg-[#D1FAE5] rounded-full px-2 py-0.5">
                Hiring Funnel
              </span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">
              {userProfile?.hunting_gap ?? insights?.hiring_funnel_gap?.title ?? "Hiring Funnel Gap"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {userProfile?.hunting_gap_detail ?? insights?.hiring_funnel_gap?.body ?? "Maya is analysing your pipeline."}
            </p>

            {/* Funnel steps */}
            <div className="flex gap-2 mb-3">
              {[
                { label: "Applied", value: displayFunnel.applied || "—", active: displayFunnel.applied > 0 },
                { label: "Screening", value: displayFunnel.screening || "—", active: displayFunnel.screening > 0 },
                { label: "Final", value: displayFunnel.final || "—", active: displayFunnel.final > 0 },
                { label: "Offer", value: displayFunnel.offer || "—", active: displayFunnel.offer > 0 },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`flex-1 rounded-lg p-2 text-center ${
                    step.active ? "bg-[#0C6B58] text-white" : "bg-[#F3F4F6] text-gray-400"
                  }`}
                >
                  <p className="text-base font-bold">{step.value}</p>
                  <p className="text-[10px]">{step.label}</p>
                </div>
              ))}
            </div>

            {insights?.hiring_funnel_gap?.based_on && (
              <p className="text-xs text-gray-400">{insights.hiring_funnel_gap.based_on}</p>
            )}
          </div>
        </div>

        {/* Connecting insight */}
        {insights?.secondary_insights[0] && (
          <div className="mt-4 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0] p-3 text-xs text-[#065F46]">
            {insights.secondary_insights[0].text}
          </div>
        )}
      </div>

      {/* ── Last session + Confidence chart ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Last session */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center text-lg">
                🌤️
              </span>
              <div>
                <p className="text-xs text-gray-400">Last session</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {lastSession?.label ?? "Calm Reset — Pre-Interview"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Before: 4 · After: {lastSession?.score ?? "8/10"} ·{" "}
                  <span className="text-[#0C6B58]">{lastSession?.delta ?? "+3 days"}</span>
                </p>
              </div>
            </div>
            <button className="rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-gray-200 transition-colors">
              Replay
            </button>
          </div>
        </div>

        {/* Confidence chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <ConfidenceChart />
        </div>
      </div>
    </div>
  );
}
