"use client";

import { useEffect, useState } from "react";
import { CoachApiError, getInterviewChecklist } from "../../../../lib/coach/api";
import type { InterviewChecklistResponse } from "../../../../lib/coach/types";

export default function ChecklistPage() {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<InterviewChecklistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("interview_id")?.trim() || null;
    setInterviewId(id);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!interviewId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getInterviewChecklist(interviewId);
        if (!isActive) return;
        setChecklist(data);
      } catch (err) {
        if (!isActive) return;
        if (err instanceof CoachApiError && err.status === 404) {
          setError("Interview not found.");
        } else {
          setError("We couldn't load your checklist right now. Please try again.");
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
  }, [interviewId]);

  const readiness = checklist?.overall_readiness;
  const progressPct = readiness
    ? Math.round((readiness.score / readiness.total_items) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <h1 className="mb-8 text-3xl font-semibold">Interview Checklist</h1>

      {!interviewId ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          No interview selected. Go back to My Interviews and choose an interview to view the checklist.
        </div>
      ) : null}

      {isLoading ? (
        <div className="mb-6 rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">
          Loading checklist...
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          {error}
        </div>
      ) : null}

      {readiness ? (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">Overall readiness</p>
            <p className="font-semibold text-[#0D7C66]">
              {readiness.score}/{readiness.total_items} Complete
            </p>
          </div>
          <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-[#0D7C66]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">{readiness.message}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Mental & Emotional Prep</h2>
          <div className="space-y-4">
            {(checklist?.mental_prep ?? []).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                    item.checked
                      ? "bg-[#0D7C66] text-white"
                      : "border-2 border-gray-300 bg-white"
                  }`}
                >
                  {item.checked ? "✓" : ""}
                </div>
                <p className={item.checked ? "text-gray-700" : "text-gray-400"}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Logistics</h2>
            <div className="space-y-4">
              {(checklist?.logistics ?? []).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                      item.checked
                        ? "bg-[#0D7C66] text-white"
                        : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {item.checked ? "✓" : ""}
                  </div>
                  <p className={item.checked ? "text-gray-700" : "text-gray-400"}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {checklist?.tonights_plan?.length ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Tonight&apos;s plan</h2>
              <div className="space-y-3">
                {checklist.tonights_plan.map((task, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="w-16 shrink-0 font-medium text-[#0D7C66]">{task.time}</span>
                    <span className="text-gray-700">{task.task}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {checklist?.quote ? (
            <div className="rounded-2xl bg-[#0D3B32] p-6 text-white">
              <h2 className="mb-3 font-semibold">Remember</h2>
              <p className="text-lg leading-relaxed">&ldquo;{checklist.quote}&rdquo;</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}