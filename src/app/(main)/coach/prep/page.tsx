"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachApiError, createCoachPrepPlan, getCoachPrepPlan, getInterviews } from "../../../../lib/coach/api";
import type { CoachPrepPlanResponse } from "../../../../lib/coach/types";
import type { Interview } from "../../../../lib/coach/api";

const WORRY_OPTIONS = [
  { label: "Panel anxiety", subtitle: "Multiple interviewers at once", worryInput: "Panel anxiety" },
  { label: "On-site pressure", subtitle: "Body language, commute stress, unknown space", worryInput: "On-site pressure" },
  { label: "Imposter syndrome", subtitle: "Am I actually ready for this level?", worryInput: "Imposter syndrome" },
  { label: "Portfolio review", subtitle: "Defending decisions in real time", worryInput: "Portfolio review" },
  { label: "Blank mind on follow-up questions", subtitle: "Freezing when pushed to go deeper", worryInput: "Blank mind on follow-up questions" },
];

function formatInterviewMeta(interview: Interview): string {
  const parts: string[] = [];
  try {
    const d = new Date(interview.interview_date);
    parts.push(d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
  } catch { /* ignore */ }
  if (interview.event_type) parts.push(interview.event_type.replace(/_/g, " "));
  return parts.join(" · ");
}

function mapLoadError(error: unknown) {
  if (error instanceof CoachApiError && error.status >= 500) return "Coach prep is temporarily unavailable. Please try again shortly.";
  return "We couldn't load your prep plan right now.";
}

function mapGenerateError(error: unknown) {
  if (error instanceof CoachApiError && error.status >= 500) return "Plan generation is temporarily unavailable. Please try again shortly.";
  return "We couldn't generate your prep plan. Please try again.";
}

export default function CoachPrepPage() {
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [selectedWorry, setSelectedWorry] = useState<string>(WORRY_OPTIONS[0].worryInput);
  const [prepPlan, setPrepPlan] = useState<CoachPrepPlanResponse | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("interview_id")?.trim() || null;
    setInterviewId(id);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!interviewId) {
        setIsLoadingPlan(false);
        return;
      }

      setIsLoadingPlan(true);
      setLoadError(null);

      try {
        const [planResult, interviewsResult] = await Promise.allSettled([
          getCoachPrepPlan(interviewId),
          getInterviews(),
        ]);

        if (!isActive) return;

        if (planResult.status === "fulfilled") {
          setPrepPlan(planResult.value);
        } else if (planResult.status === "rejected") {
          const err = planResult.reason;
          if (!(err instanceof CoachApiError && err.status === 404)) {
            setLoadError(mapLoadError(err));
          }
        }

        if (interviewsResult.status === "fulfilled") {
          const all = [...interviewsResult.value.upcoming, ...interviewsResult.value.past];
          const found = all.find((i) => i.id === interviewId) ?? null;
          setInterview(found);
        }
      } finally {
        if (!isActive) return;
        setIsLoadingPlan(false);
      }
    }

    load();
    return () => { isActive = false; };
  }, [interviewId]);

  const planItems = useMemo(() => prepPlan?.plan ?? [], [prepPlan]);
  const hasSavedPlan = Boolean(prepPlan);
  const canGenerate = Boolean(interviewId) && !isGenerating;

  async function handleGeneratePlan() {
    if (!interviewId || isGenerating) return;
    setGenerateError(null);
    setIsGenerating(true);
    try {
      const data = await createCoachPrepPlan(interviewId, selectedWorry);
      setPrepPlan(data);
    } catch (error) {
      setGenerateError(mapGenerateError(error));
    } finally {
      setIsGenerating(false);
    }
  }

  const interviewTitle = interview
    ? `${interview.role} @ ${interview.company}`
    : "Your interview";

  const interviewMeta = interview ? formatInterviewMeta(interview) : "";

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      {/* Header */}
      <div className="mb-2 flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow" aria-label="Go back">
          ←
        </button>
        <div>
          <p className="text-sm text-gray-500">Coach prep · My Interviews</p>
          <h1 className="text-2xl font-semibold text-[#1D1D1D]">Start prep — {interviewTitle}</h1>
          {interviewMeta ? <p className="text-sm text-gray-500">{interviewMeta}</p> : null}
        </div>
      </div>

      {/* Maya quote */}
      <div className="mb-6 mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-gray-700">
          &quot;{hasSavedPlan
            ? `Here's your saved prep plan for ${interviewTitle}. You can adjust your worry and regenerate if needed.`
            : `Let's build your prep properly — starting with what's actually worrying you about this one.`}&quot;
        </p>
        <div className="mt-3 inline-block rounded-full bg-[#DFF5EF] px-4 py-1.5 text-sm text-[#0D7C66]">
          This creates a personalized prep plan for {interview?.company ?? "this interview"}
        </div>
      </div>

      {isLoadingPlan ? (
        <div className="mb-6 rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">Loading your prep plan...</div>
      ) : null}

      {loadError ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">{loadError}</div>
      ) : null}

      {!interviewId ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          No interview selected. Go back to My Interviews and choose one to start prep.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left — worries */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-[#1D1D1D]">What worries you the most about this one?</h2>

          <div className="space-y-3">
            {WORRY_OPTIONS.map((item) => {
              const isSelected = selectedWorry === item.worryInput;
              return (
                <button
                  type="button"
                  key={item.worryInput}
                  onClick={() => setSelectedWorry(item.worryInput)}
                  disabled={isGenerating}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected ? "border-[#0D7C66] bg-[#E8F7F2]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-[#1D1D1D]">{item.label}</p>
                  {isSelected ? <p className="mt-0.5 text-sm text-[#0D7C66]">{item.subtitle}</p> : null}
                </button>
              );
            })}
          </div>

          {hasSavedPlan ? (
            <p className="mt-5 text-sm text-gray-500">Saved plan found. You can adjust your worry and regenerate it if needed.</p>
          ) : null}

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={!canGenerate}
            className="mt-5 rounded-xl bg-[#0D7C66] px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating
              ? hasSavedPlan ? "Regenerating..." : "Generating..."
              : hasSavedPlan ? "Regenerate prep plan" : "Generate prep plan"}
          </button>

          {generateError ? <p className="mt-3 text-sm text-[#A94442]">{generateError}</p> : null}
        </div>

        {/* Right — plan */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-[#1D1D1D]">
              Maya&apos;s {interview ? `${planItems.length || 5} day` : ""} prep plan
            </h2>

            {planItems.length > 0 ? (
              <div className="space-y-5">
                {planItems.map((step, index) => (
                  <div key={`${step.day}-${index}`} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D7C66] text-sm font-medium text-white">
                      {step.day}
                    </div>
                    <div>
                      <p className="font-medium text-[#1D1D1D]">{step.task}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{step.description} · {step.duration_mins} min</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Select a worry and generate your personalized plan.</p>
            )}
          </div>

          {prepPlan?.coach_note ? (
            <div className="rounded-2xl border border-[#8DD8C4] bg-[#DFF5EF] p-4 text-sm text-[#065F46]">
              {prepPlan.coach_note}
            </div>
          ) : null}

          {prepPlan?.recommended_first_session ? (
            <div className="rounded-2xl bg-[#0B3F35] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9BD6C8]">Ready to begin</p>
              <p className="mt-2 text-lg font-semibold">
                Start with {prepPlan.recommended_first_session.session_type.replaceAll("_", " ")} ({prepPlan.recommended_first_session.duration_mins} min)
              </p>
              <p className="mt-1 text-sm text-[#CFE7E0]">{prepPlan.recommended_first_session.reason}</p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-[#7FB8AA] py-3 text-white hover:bg-[#0D5446] transition"
              >
                Start intake session →
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}