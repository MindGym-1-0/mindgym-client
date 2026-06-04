"use client";

import { useEffect, useState } from "react";
import LogoutButton from "../../../components/auth/logout-button";
import { useUserName } from "@/hooks/useUserName";
import { getInterviews, type InterviewItem } from "@/lib/interviews/api";
import { getSessionHistory } from "@/lib/session/api";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }) + " — " + date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) + ` — ${timeStr}`;
}

export default function DashboardPage() {
  const name = useUserName();
  const [dateStr, setDateStr] = useState("");
  const [nextInterview, setNextInterview] = useState<InterviewItem | null>(null);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [interviewCount, setInterviewCount] = useState<number | null>(null);

  useEffect(() => {
    setDateStr(formatDate(new Date()));
  }, []);

  useEffect(() => {
    getInterviews()
      .then(({ upcoming }) => {
        setNextInterview(upcoming[0] ?? null);
        setInterviewCount(upcoming.length);
      })
      .catch((err) => console.error("Failed to load interviews:", err));

    getSessionHistory()
      .then((sessions) => setSessionCount(sessions.length))
      .catch((err) => console.error("Failed to load session history:", err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-semibold text-[#1A1A1A]">Good morning, {name}.</h1>
          <p className="mt-2 text-gray-500">{dateStr}</p>
        </div>
        <LogoutButton />
      </div>

      {nextInterview ? (
        <div className="rounded-3xl bg-[#0C6B58] p-8 text-white">
          <p className="mb-2 text-sm opacity-80">
            {nextInterview.event_type} — {formatInterviewTime(nextInterview.interview_date)}
          </p>
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            {nextInterview.role} @ {nextInterview.company}
          </h2>
          {nextInterview.notes && (
            <p className="mt-3 text-sm opacity-80">{nextInterview.notes}</p>
          )}
          <div className="mt-6 flex gap-4">
            <button className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black">
              Prepare with Maya {"->"}
            </button>
            <button className="rounded-xl border border-white/30 px-5 py-3 text-sm">
              View details
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0C6B58] p-8 text-white">
          <p className="mb-2 text-sm opacity-80">No upcoming interviews</p>
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            Ready when you are.
          </h2>
          <div className="mt-6">
            <button className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black">
              Start a session {"->"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-4xl font-semibold text-[#0C6B58]">
            {sessionCount ?? "—"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">Sessions done</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-4xl font-semibold text-[#F59E0B]">—</h3>
          <p className="mt-2 text-sm text-gray-500">Day streak</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-4xl font-semibold text-[#0C6B58]">—</h3>
          <p className="mt-2 text-sm text-gray-500">Confidence lift</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-4xl font-semibold text-[#1A1A1A]">
            {interviewCount ?? "—"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">Interviews set</p>
        </div>
      </div>
    </div>
  );
}
