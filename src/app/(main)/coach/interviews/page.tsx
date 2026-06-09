// src/app/(main)/coach/interviews/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachApiError, getInterviews } from "../../../../lib/coach/api";
import type { Interview } from "../../../../lib/coach/api";

function formatInterviewDate(raw: string): string {
  try {
    const d = new Date(raw);
    const now = new Date();
    const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 0) return `Today - ${time}`;
    if (diffDays === 1) return `Tomorrow - ${time}`;
    if (diffDays > 1) return `In ${diffDays} days - ${time}`;
    return d.toLocaleDateString();
  } catch {
    return raw;
  }
}

function formatPastDate(raw: string): string {
  try {
    const d = new Date(raw);
    const diffDays = Math.round((new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    const weeks = Math.round(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } catch {
    return raw;
  }
}

export default function InterviewsPage() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Interview[]>([]);
  const [past, setPast] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getInterviews();
        if (!isActive) return;
        setUpcoming(data.upcoming ?? []);
        setPast(data.past ?? []);
      } catch (err) {
        if (!isActive) return;
        if (err instanceof CoachApiError && err.status >= 500) {
          setError("Couldn't load interviews right now. Please try again shortly.");
        } else {
          setError("Couldn't load interviews.");
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

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Interviews</h1>
          <p className="mt-1 text-gray-500">Track and prepare for every upcoming interview</p>
        </div>
        <button
          onClick={() => router.push("/coach/interviews/add")}
          className="rounded-xl bg-[#0D7C66] px-5 py-3 text-white"
        >
          + Add interview
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">
          Loading interviews...
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && upcoming.length === 0 ? (
        <div className="mb-6 rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm">
          No upcoming interviews. Add one to start prep.
        </div>
      ) : null}

      <div className="space-y-5">
        {upcoming.map((interview) => {
          const hasInterviewId = Boolean(interview.id?.trim());

          return (
            <div
              key={interview.id}
              className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {interview.company} - {interview.role}
                </h2>
                <p className="text-gray-500">
                  {formatInterviewDate(interview.interview_date)}
                  {interview.event_type ? ` - ${interview.event_type}` : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!hasInterviewId}
                  onClick={() => {
                    if (!hasInterviewId) return;
                    router.push(`/coach/checklist?interview_id=${interview.id}`);
                  }}
                  className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  View checklist
                </button>
                <button
                  type="button"
                  disabled={!hasInterviewId}
                  onClick={() => {
                    if (!hasInterviewId) return;
                    router.push(`/coach/prep?interview_id=${interview.id}`);
                  }}
                  className="rounded-lg bg-[#0D7C66] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {"Start prep ->"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {past.length > 0 ? (
        <>
          <h2 className="mb-4 mt-12 text-xl font-semibold">Past interviews</h2>
          <div className="rounded-2xl bg-white shadow-sm">
            {past.map((interview, i) => (
              <div
                key={interview.id}
                className={`flex items-center justify-between p-6 ${
                  i < past.length - 1 ? "border-b" : ""
                }`}
              >
                <div>
                  <h3 className="font-medium">
                    {interview.company} - {interview.role}
                  </h3>
                  <p className="text-sm text-gray-500">{formatPastDate(interview.interview_date)}</p>
                </div>
                <button
                  onClick={() => router.push(`/coach/interview-checkin?interview_id=${interview.id}`)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  {"Recovery session ->"}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
