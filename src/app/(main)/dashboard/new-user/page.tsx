"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { getGreeting } from "@/lib/greeting";
import { getSessionHistory } from "@/lib/session/api";
import { clearSetup } from "@/lib/session/store";

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

// ─── sub-components ─────────────────────────────────────────────────────────

/** Mood emoji row in the top-right */
function MoodTracker() {
  const moods = ["😊", "😄", "😐", "😟", "😞"];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#E7E5E4] bg-white px-4 py-2.5 shadow-sm">
      <span className="text-xs font-medium text-[#171412] mr-1">Mood today</span>
      {moods.map((emoji, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={`text-base rounded-full w-8 h-8 flex items-center justify-center transition-all ${
            selected === i
              ? "bg-[#0C6B58]/10 ring-2 ring-[#0C6B58]"
              : "hover:bg-gray-100"
          }`}
        >
          {emoji}
        </button>
      ))}
      <button className="ml-1 rounded-xl bg-[#126658] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0d5247] transition-colors">
        Log
      </button>
    </div>
  );
}

/** Circular progress ring for today's focus */
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
          style={{ fontSize: 22, fontWeight: 700, fill: "#171412" }}
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

// ─── main page ───────────────────────────────────────────────────────────────

export default function NewUserDashboardPage() {
  const name = useUserName();
  const router = useRouter();
  const [dateStr, setDateStr] = useState("");
  const [lastSession, setLastSession] = useState<{
    title: string;
    duration: string;
    type: string;
    anxietyBefore: number;
    anxietyAfter: number;
  } | null>(null);

  function handleStartSession() {
    clearSetup();
    router.push("/sessions/setup/emotions");
  }

  useEffect(() => {
    setDateStr(formatDate(new Date()));
  }, []);

  useEffect(() => {
    getSessionHistory()
      .then((sessions) => {
        if (sessions.length > 0) {
          const s = sessions[sessions.length - 1];
          setLastSession({
  title:
    s.preparation_for
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Envisioning Success — Breaking the Rejection Spiral",

  duration: "5 minutes",

  type: "Mind reset",

  anxietyBefore: s.anxiety_level_before ?? 7,

  anxietyAfter:
    s.anxiety_level_after ??
    s.anxiety_level_before,
});
        }
      })
      .catch((err) => console.error("Failed to load session history:", err));
  }, []);

  // Fallback to hard-coded session data for new users before first session loads
  const session = lastSession ?? {
    title: "Envisioning Success — Breaking the Rejection Spiral",
    duration: "5 minutes",
    type: "Mind reset",
    anxietyBefore: 7,
    anxietyAfter: 4,
  };

  const anxietyDelta = session.anxietyBefore - session.anxietyAfter;

  // New-user focus tasks
  const focusTasks = [
    {
      id: 1,
      title: "Add your first interview",
      subtitle: "I'll build a real prep plan around it.",
      tag: "Unlocks prep",
      tagColor: "bg-[#FEF3C7] text-[#92400E]",
      done: false,
      action: () => router.push("/coach/interviews/add"),
    },
    {
      id: 2,
      title: "Complete today's 5-min visualization",
      subtitle: "Picture the panel room before you were all in it.",
      tag: "Daily",
      tagColor: "bg-[#D1FAE5] text-[#065F46]",
      done: false,
      action: handleStartSession,
    },
    {
      id: 3,
      title: "Log your mood for today",
      subtitle: "One tap. It teaches me how to coach you.",
      tag: "Daily",
      tagColor: "bg-[#D1FAE5] text-[#065F46]",
      done: false,
      action: () => {},
    },
  ];
  const doneCount = focusTasks.filter((t) => t.done).length;

  // Next steps (right side of hero)
  const nextSteps = [
    {
      num: 1,
      title: "Add an upcoming interview",
      subtitle: "Maya will build a personalised prep plan around it.",
      cta: "Add",
      ctaAction: () => router.push("/coach/interviews/add"),
      active: true,
    },
    {
      num: 2,
      title: "Complete tomorrow's session",
      subtitle: "Panel room visualisation — 11 min · Scheduled for 9:00 AM",
      cta: null,
      ctaAction: null,
      active: false,
    },
    {
      num: 3,
      title: "Update your job hunting activity",
      subtitle: "Helps Maya track gaps as the search progresses.",
      cta: null,
      ctaAction: null,
      active: false,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#686460]">
            Overview <span className="mx-1.5 text-[#C4BEB9]">›</span> Daily Dashboard
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">{dateStr}</p>
          <h1 className="mt-4 text-[34px] font-semibold leading-[42px] text-[#171412]">
            {getGreeting(name)} 👋
          </h1>
          <p className="mt-2 text-sm text-[#686460]">
            You completed your first session. Here&apos;s where your journey starts.
          </p>
        </div>
        <MoodTracker />
      </div>

      {/* ── Hero: Last session + Next steps ── */}
      <div className="grid grid-cols-5 gap-4">

        {/* Last session card (3/5) */}
        <div className="col-span-3 rounded-[28px] bg-[#126658] p-8 text-white relative overflow-hidden">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D7F3EC] mb-1">
            Session 1 complete · Today
          </p>
          <h2 className="mt-3 text-[28px] font-semibold leading-[36px] max-w-xs">
            {session.title}
          </h2>
          <p className="mt-3 text-sm text-[#D7F3EC]">
            {session.duration} · {session.type}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push("/sessions/summary")}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#126658] hover:bg-gray-50 transition-colors"
            >
              View session summary →
            </button>
            <button
              onClick={() => router.push("/coach/interviews/add")}
              className="rounded-xl border border-[#D7F3EC]/50 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Add your first interview
            </button>
          </div>

          {/* Anxiety lift meter */}
          <div className="absolute top-8 right-8 rounded-2xl bg-[#0D4E43] px-6 py-5 text-center min-w-[120px]">
            <p className="text-[10px] font-medium tracking-wider uppercase text-[#BFE7DD] mb-3">
              Anxiety lift
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl font-semibold text-white">{session.anxietyBefore}</span>
              <div className="text-left text-sm text-[#BFE7DD] leading-5">
                <span>→ {session.anxietyAfter}</span>
                <br />
                <span className="text-[#7EDFC8]">-{anxietyDelta} reduction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps (2/5) */}
        <div className="col-span-2 rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#686460] mb-4">
            Your next steps
          </p>
          <div className="space-y-4">
            {nextSteps.map((step) => (
              <div key={step.num} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    step.active
                      ? "bg-[#126658] text-white"
                      : "bg-[#F3F4F6] text-[#9CA3AF]"
                  }`}
                >
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.active ? "text-[#171412]" : "text-[#9CA3AF]"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-4">{step.subtitle}</p>
                </div>
                {step.cta && step.ctaAction && (
                  <button
                    onClick={step.ctaAction}
                    className="flex-shrink-0 rounded-xl bg-[#126658] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d5247] transition-colors"
                  >
                    {step.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Today's focus + progress ring ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Focus tasks (2/3) */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          {/* Header row */}
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
          <p className="text-sm text-gray-600 mb-4">
            No interview yet — and that's fine. Today is about building the habit so you're ready the moment one lands.
          </p>

          {/* Tasks */}
          <div className="space-y-2">
            {focusTasks.map((task) => (
              <button
                key={task.id}
                onClick={task.action}
                className="w-full text-left flex items-start gap-3 rounded-xl p-3 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
              >
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A]">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{task.subtitle}</p>
                </div>
                {task.tag && (
                  <span className={`text-xs rounded-full px-2 py-0.5 flex-shrink-0 font-medium ${task.tagColor}`}>
                    {task.tag}
                  </span>
                )}
              </button>
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
            onClick={handleStartSession}
            className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
          >
            View Full Plan →
          </button>
        </div>
      </div>

      {/* ── What's getting in your way ── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">What's getting in your way</h2>
          <span className="text-xs bg-[#F3F4F6] rounded-full px-3 py-1 text-gray-500">
            2 gaps tracked
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Maya tracks two kinds of gaps — what's happening in your{" "}
          <span className="text-[#EF4444] font-medium">mindset</span> and in your{" "}
          <span className="text-[#0C6B58] font-medium">hiring funnel</span>{" "}
          — and works them together, not in isolation.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Mindset card */}
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#EF4444] bg-red-50 rounded-full px-2 py-0.5">
                Mindset
              </span>
              <span className="text-xs text-[#0C6B58] hover:underline cursor-pointer">Learn more</span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">Rejection sensitivity</h3>
            <p className="text-xs text-gray-500 mb-4">
              Confidence is eroding faster than it's being rebuilt — the focus of your first three sessions.
            </p>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Anxiety baseline</span>
                <span className="font-medium text-[#1A1A1A]">7/10</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: "70%" }} />
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Target 3/10 · green marker is the goal
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Maya's plan:{" "}
              <span className="text-[#0C6B58]">5 visualization + reframing sessions</span>
            </p>
          </div>

          {/* Hiring funnel card */}
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#0C6B58] bg-[#D1FAE5] rounded-full px-2 py-0.5">
                Hiring Funnel
              </span>
              <span className="text-xs text-[#0C6B58] hover:underline cursor-pointer">Being tracked</span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">Screening → final conversion</h3>
            <p className="text-xs text-gray-500 mb-4">
              You turn applications into screens, but stall before the final round. Maya will surface the pattern.
            </p>
            <div className="flex gap-2 mb-3">
              {[
                { label: "Applied", value: 12, active: true },
                { label: "Screening", value: 2, active: true },
                { label: "Final", value: 1, active: false },
                { label: "Offer", value: 0, active: false },
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
            <p className="text-xs text-gray-400">
              Maya's plan:{" "}
              <span className="text-[#0C6B58] cursor-pointer hover:underline">
                update activity to unlock the pattern
              </span>
            </p>
          </div>
        </div>

        {/* Connecting insight */}
        <div className="mt-4 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0] p-3 text-xs text-[#065F46]">
          These two feed each other — rejection wears down confidence, which slows the search and invites more rejection.{" "}
          <span className="font-semibold">Maya works both sides of the loop at once.</span>
        </div>
      </div>
    </div>
  );
}
