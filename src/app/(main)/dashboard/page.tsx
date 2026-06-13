"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { getGreeting } from "@/lib/greeting";
import { getInterviews, type InterviewItem } from "@/lib/interviews/api";
import { getSessionHistory, getSessionDetail } from "@/lib/session/api";
import { writeSetup, clearSetup, writeActive } from "@/lib/session/store";
import { getInsights, getUserProfile, type InsightsResponse, type UserProfile } from "@/lib/insights/api";
import { getApplications, toFunnelCounts, type FunnelCounts } from "@/lib/applications/api";
import { generateDailyFocus, completeDailyFocus, type DailyFocusPlan } from "@/lib/daily-focus/api";
import { generateWeeklyMission, completeWeeklyMission, type WeeklyMissionPlan } from "@/lib/weekly-focus/api";

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

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

function actionTypeToTag(type: string | null): string | null {
  if (!type) return null;
  const map: Record<string, string | null> = {
    prepare_interview: "Interview Prep",
    follow_up: "Follow Up",
    add_applications: "Pipeline",
    generic_pipeline: null,
  };
  return map[type] ?? null;
}

// ─── sub-components ─────────────────────────────────────────────────────────

const MOODS = ["😊", "😄", "😐", "😟", "😞"] as const;
const MOOD_MESSAGES = [
  { tone: "positive", text: "Great energy today. Keep the momentum going." },
  { tone: "positive", text: "You're feeling confident. A good day to tackle challenges." },
  { tone: "neutral", text: "Feeling balanced today. Stay consistent." },
  { tone: "low", text: "Looks like you're feeling a little stressed. Maya can help." },
  { tone: "low", text: "Tough day? Take a few minutes with Maya to reset." },
] as const;

function MoodTracker({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-gray-500">Mood today</span>
      {MOODS.map((emoji, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all ${
            selected === i ? "ring-2 ring-[#0C6B58] bg-[#0C6B58]/10" : "hover:bg-gray-100"
          }`}
        >
          {emoji}
        </button>
      ))}
      <button className="ml-2 rounded-lg bg-[#1A1A1A] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black">
        Log
      </button>
    </div>
  );
}

function ReadinessDots({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i < value ? "bg-white" : "bg-white/30"}`}
        />
      ))}
    </div>
  );
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? done / total : 0;
  const offset = circ * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx="55" cy="55" r={r}
          fill="none" stroke="#0C6B58" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 55 55)"
        />
        <text x="55" y="51" textAnchor="middle" dominantBaseline="middle"
          className="fill-[#1A1A1A]" style={{ fontSize: 22, fontWeight: 700 }}>
          {done}/{total}
        </text>
        <text x="55" y="68" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 10, fill: "#6B7280" }}>
          done today
        </text>
      </svg>
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
  const [prepSessionCount, setPrepSessionCount] = useState<number>(0);
  const [interviewCount, setInterviewCount] = useState<number | null>(null);
  const [lastSession, setLastSession] = useState<{ id: string; label: string; score: string; delta: string; anxietyBefore: number } | null>(null);
  const [replayingLastSession, setReplayingLastSession] = useState(false);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [funnelCounts, setFunnelCounts] = useState<FunnelCounts | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  // ── Focus state ──────────────────────────────────────────────────────────
  const [focusTab, setFocusTab] = useState<"today" | "week">("today");
  const [dailyFocus, setDailyFocus] = useState<DailyFocusPlan | null>(null);
  const [weeklyMission, setWeeklyMission] = useState<WeeklyMissionPlan | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(1);
  const [focusLoading, setFocusLoading] = useState(true);
  const [completingAction, setCompletingAction] = useState<string | null>(null);

  // ── handlers ─────────────────────────────────────────────────────────────

  function handlePrepareWithMaya(interview: InterviewItem) {
    clearSetup();
    writeSetup({
      preparation_for: "interview_tomorrow",
      company: interview.company,
      role: interview.role,
    });
    router.push("/sessions/setup/emotions");
  }

  async function handleReplayLastSession() {
    if (!lastSession || replayingLastSession) return;
    setReplayingLastSession(true);
    try {
      const detail = await getSessionDetail(lastSession.id);
      writeActive({
        session_id: detail.id,
        script: detail.script,
        anxiety_level_before: lastSession.anxietyBefore,
      });
      router.push("/sessions/active");
    } catch (err) {
      console.error("Failed to replay session:", err);
      setReplayingLastSession(false);
    }
  }

  function handleStartSession() {
    clearSetup();
    router.push("/sessions/setup/emotions");
  }

  async function handleToggleDailyAction(actionId: "action_1" | "action_2") {
    if (!dailyFocus || completingAction) return;
    const field = `${actionId}_completed` as keyof DailyFocusPlan;
    if (dailyFocus[field]) return;

    setDailyFocus((prev) => prev ? { ...prev, [field]: true } : prev);
    setCompletingAction(actionId);
    try {
      const res = await completeDailyFocus(actionId);
      setCurrentStreak(res.current_streak);
    } catch (err) {
      console.error("Failed to complete daily action:", err);
      setDailyFocus((prev) => prev ? { ...prev, [field]: false } : prev);
    } finally {
      setCompletingAction(null);
    }
  }

  async function handleToggleWeeklyAction(itemId: "action_1" | "action_2" | "action_3") {
    if (!weeklyMission || completingAction) return;
    const field = `${itemId}_completed` as keyof WeeklyMissionPlan;
    if (weeklyMission[field]) return;

    setWeeklyMission((prev) =>
      prev ? { ...prev, [field]: true, completion_count: prev.completion_count + 1 } : prev
    );
    setCompletingAction(itemId);
    try {
      const res = await completeWeeklyMission(itemId);
      setWeeklyMission((prev) =>
        prev ? { ...prev, completion_count: res.items_completed } : prev
      );
    } catch (err) {
      console.error("Failed to complete weekly action:", err);
      setWeeklyMission((prev) =>
        prev ? { ...prev, [field]: false, completion_count: Math.max(0, prev.completion_count - 1) } : prev
      );
    } finally {
      setCompletingAction(null);
    }
  }

  // ── data loading ──────────────────────────────────────────────────────────

  useEffect(() => {
    setDateStr(formatDate(new Date()));
  }, []);

  useEffect(() => {
    Promise.all([
      generateDailyFocus().catch((err) => { console.error("Failed to load daily focus:", err); return null; }),
      generateWeeklyMission().catch((err) => { console.error("Failed to load weekly mission:", err); return null; }),
    ]).then(([daily, weekly]) => {
      if (daily) setDailyFocus(daily);
      if (weekly) setWeeklyMission(weekly);
      setFocusLoading(false);
    });
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
        setPrepSessionCount(sessions.filter((s) => s.preparation_for === "interview_tomorrow").length);
        if (sessions.length > 0) {
          const s = sessions[0];
          setLastSession({
            id: s.id,
            label:
              s.preparation_for
                ?.replaceAll("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) ??
              "Calm Reset – Pre-Interview",
            score: `${s.anxiety_level_after ?? s.anxiety_level_before}/10`,
            delta:
              s.anxiety_level_delta !== null
                ? `${s.anxiety_level_delta > 0 ? "+" : ""}${s.anxiety_level_delta}`
                : "—",
            anxietyBefore: s.anxiety_level_before,
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

  // ── derived state ─────────────────────────────────────────────────────────

  const dailyTasks = dailyFocus
    ? [
        {
          id: "action_1" as const,
          title: dailyFocus.action_1_text,
          tag: actionTypeToTag(dailyFocus.action_1_type),
          done: dailyFocus.action_1_completed,
        },
        ...(dailyFocus.action_2_text
          ? [{
              id: "action_2" as const,
              title: dailyFocus.action_2_text,
              tag: actionTypeToTag(dailyFocus.action_2_type),
              done: dailyFocus.action_2_completed,
            }]
          : []),
      ]
    : [];

  const weeklyTasks = weeklyMission
    ? [
        { id: "action_1" as const, title: weeklyMission.action_1, done: weeklyMission.action_1_completed },
        { id: "action_2" as const, title: weeklyMission.action_2, done: weeklyMission.action_2_completed },
        { id: "action_3" as const, title: weeklyMission.action_3, done: weeklyMission.action_3_completed },
      ]
    : [];

  const activeTasks = focusTab === "today" ? dailyTasks : weeklyTasks;
  const doneCount = focusTab === "today"
    ? dailyTasks.filter((t) => t.done).length
    : weeklyMission?.completion_count ?? 0;
  const totalCount = focusTab === "today" ? (dailyTasks.length || 1) : 3;

  const hasTrackedApps = funnelCounts !== null && Object.values(funnelCounts).some((v) => v > 0);
  const displayFunnel = hasTrackedApps
    ? funnelCounts!
    : {
        applied: userProfile?.applications_sent_max ?? userProfile?.applications_sent_min ?? 0,
        screening: userProfile?.recruiter_contacts ?? 0,
        final: userProfile?.first_round_interviews ?? 0,
        offer: userProfile?.offers ?? 0,
      };

  const nextUpInterview = upcomingInterviews[1] ?? null;

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#1A1A1A]">
            {getGreeting(name)} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-400">{dateStr}</p>
        </div>
        <MoodTracker selected={selectedMood} onSelect={setSelectedMood} />
      </div>

      {/* ── Mood callout ── */}
      {selectedMood !== null && (() => {
        const mood = MOOD_MESSAGES[selectedMood];
        const isLow = mood.tone === "low";
        return (
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl px-4 py-3 text-sm ${
            isLow
              ? "bg-[#FFF7ED] border border-[#FED7AA] text-[#92400E]"
              : mood.tone === "positive"
              ? "bg-[#F0FDF9] border border-[#A7F3D0] text-[#065F46]"
              : "bg-[#F3F4F6] border border-gray-200 text-gray-600"
          }`}>
            <span>{MOODS[selectedMood]} {mood.text}</span>
            {isLow && (
              <button
                onClick={handleStartSession}
                className="sm:ml-4 flex-shrink-0 rounded-lg bg-[#0C6B58] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0a5a49] transition-colors self-start sm:self-auto"
              >
                Start a session →
              </button>
            )}
          </div>
        );
      })()}

      {/* ── Interview banner + Next up ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-[#0C6B58] p-6 text-white relative overflow-hidden">
          {nextInterview ? (
            <>
              <p className="text-xs opacity-70 mb-1 pr-24 sm:pr-0">
                {nextInterview.event_type} · {formatInterviewTime(nextInterview.interview_date)}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight max-w-xs pr-24 sm:pr-0">
                {nextInterview.role} @{" "}
                <span className="block">{nextInterview.company}</span>
              </h2>
              {nextInterview.notes && (
                <p className="mt-1 text-xs opacity-60 pr-24 sm:pr-0">{nextInterview.notes}</p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => handlePrepareWithMaya(nextInterview)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  Prepare with Maya →
                </button>
                <button
                  onClick={() => router.push(`/coach/checklist?interview_id=${nextInterview.id}`)}
                  className="rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                  View checklist
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs opacity-70 mb-1">No upcoming interviews</p>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">Ready when you are.</h2>
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
          {nextInterview && (
            <div className="absolute top-6 right-6 text-right">
              <p className="text-xs opacity-60">Readiness</p>
              <p className="text-4xl font-bold">8</p>
              <p className="text-xs opacity-60">out of 10</p>
              <ReadinessDots value={8} />
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm flex flex-col justify-between">
          {nextUpInterview ? (
            <>
              <div>
                <p className="text-xs text-gray-400 mb-1">Next up — next week</p>
                <p className="text-xs text-gray-500">{formatInterviewTime(nextUpInterview.interview_date)}</p>
                <h3 className="mt-2 text-base font-semibold text-[#1A1A1A] leading-snug">
                  {nextUpInterview.role} @ {nextUpInterview.company}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {daysUntil(nextUpInterview.interview_date)} days away · {prepSessionCount} prep sessions
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
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-4">
              <p className="text-sm text-gray-400">
                {nextInterview ? "That's your only one coming up." : "No interviews scheduled yet."}
              </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
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
              <button
                onClick={() => setFocusTab("today")}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  focusTab === "today" ? "bg-[#1A1A1A] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFocusTab("week")}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  focusTab === "week" ? "bg-[#1A1A1A] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                This week
              </button>
            </div>
          </div>

          {focusLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : activeTasks.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No tasks available right now.</p>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <button
                  key={task.id}
                  disabled={task.done || !!completingAction}
                  onClick={() =>
                    focusTab === "today"
                      ? handleToggleDailyAction(task.id as "action_1" | "action_2")
                      : handleToggleWeeklyAction(task.id as "action_1" | "action_2" | "action_3")
                  }
                  className={`w-full text-left flex items-start gap-3 rounded-xl p-3 transition-colors disabled:opacity-60 ${
                    task.done ? "bg-[#F0FDF9] cursor-default" : "bg-[#F9FAFB] hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.done ? "bg-[#0C6B58] border-[#0C6B58]" : "border-gray-300"
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
                  </div>
                  {("tag" in task && task.tag) ? (
                    <span className="text-xs text-[#0C6B58] bg-[#D1FAE5] rounded-full px-2 py-0.5 flex-shrink-0">
                      {task.tag as string}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-400">↻ Resets each morning</p>
        </div>

        <div className="rounded-2xl bg-[#F9FAFB] p-6 shadow-sm flex flex-col items-center justify-between">
          <ProgressRing done={doneCount} total={totalCount} />
          <p className="mt-3 text-xs text-center text-gray-500">
            {focusTab === "today"
              ? "Finish all tasks to keep your streak alive."
              : `${doneCount} of 3 weekly targets done.`}
          </p>
          <button
            onClick={() => router.push("/coach/interviews")}
            className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
          >
            View Full Plan →
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-2xl sm:text-4xl font-bold text-[#0C6B58]">{sessionCount ?? "—"}</h3>
          <p className="mt-1 text-xs text-gray-500">Sessions done</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-2xl sm:text-4xl font-bold text-[#F59E0B] flex items-center gap-1">
            {currentStreak} <span className="text-xl">🔥</span>
          </h3>
          <p className="mt-1 text-xs text-gray-500">Day streak</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A]">{interviewCount ?? "—"}</h3>
          <p className="mt-1 text-xs text-gray-500">Interviews set</p>
        </div>
      </div>

      {/* ── What's getting in your way ── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">What's getting in your way</h2>
          {(userProfile?.mindset_gap || userProfile?.hunting_gap) && (
            <span className="text-xs bg-[#F3F4F6] rounded-full px-3 py-1 text-gray-500 self-start sm:self-auto">
              {[userProfile.mindset_gap, userProfile.hunting_gap].filter(Boolean).length} gaps tracked
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Maya tracks two kinds of gaps — what's happening in your{" "}
          <span className="text-[#EF4444] font-medium">mindset</span> and in your{" "}
          <span className="text-[#0C6B58] font-medium">hiring funnel</span> — and works them together, not in isolation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[
                { label: "Applied", value: displayFunnel.applied || "—", active: displayFunnel.applied > 0 },
                { label: "Screening", value: displayFunnel.screening || "—", active: displayFunnel.screening > 0 },
                { label: "Final", value: displayFunnel.final || "—", active: displayFunnel.final > 0 },
                { label: "Offer", value: displayFunnel.offer || "—", active: displayFunnel.offer > 0 },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`rounded-lg p-2 text-center ${
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

        {insights?.secondary_insights[0] && (
          <div className="mt-4 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0] p-3 text-xs text-[#065F46]">
            {insights.secondary_insights[0].text}
          </div>
        )}
      </div>

      {/* ── Last session ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center text-lg flex-shrink-0">
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
          <button
            onClick={handleReplayLastSession}
            disabled={replayingLastSession}
            className="rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-gray-200 transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            {replayingLastSession ? "Loading…" : "Replay"}
          </button>
        </div>
      </div>

    </div>
  );
}
