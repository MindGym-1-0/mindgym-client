"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachApiError, createCoachPrepPlan, getCoachPrepPlan } from "../../../../lib/coach/api";
import type { CoachPrepPlanResponse } from "../../../../lib/coach/types";

type WorryOption = {
  label: string;
  subtitle: string;
  worryInput: string;
};

const WORRY_OPTIONS: WorryOption[] = [
  {
    label: "Panel anxiety",
    subtitle: "Multiple interviewers at once",
    worryInput: "Panel anxiety"
  },
  {
    label: "On-site pressure",
    subtitle: "Body language, commute stress, unknown space",
    worryInput: "On-site pressure"
  },
  {
    label: "Imposter syndrome",
    subtitle: "Am I actually ready for this level?",
    worryInput: "Imposter syndrome"
  },
  {
    label: "Portfolio review",
    subtitle: "Defending decisions in real time",
    worryInput: "Portfolio review"
  },
  {
    label: "Blank mind on follow-up questions",
    subtitle: "Freezing when pushed to go deeper",
    worryInput: "Blank mind on follow-up questions"
  }
];

function mapLoadError(error: unknown) {
  if (error instanceof CoachApiError && error.status >= 500) {
    return "Coach prep is temporarily unavailable. Please try again shortly.";
  }

  return "We couldn't load your prep plan right now.";
}

function mapGenerateError(error: unknown) {
  if (error instanceof CoachApiError && error.status >= 500) {
    return "Plan generation is temporarily unavailable. Please try again shortly.";
  }

  return "We couldn't generate your prep plan. Please try again.";
}

async function startIntakeSession(sessionType: string) {
  // TODO: call Jibin's POST /api/sessions/start when the client/contract is available.
  if (process.env.NODE_ENV !== "production") {
    console.info("[coach-prep] Start intake placeholder invoked.", {
      session_type: sessionType
    });
  }

  throw new Error("Session start integration is pending.");
}

export default function CoachPrepPage() {
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const [selectedWorry, setSelectedWorry] = useState<string>(WORRY_OPTIONS[0].worryInput);
  const [prepPlan, setPrepPlan] = useState<CoachPrepPlanResponse | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isMissingSavedPlan, setIsMissingSavedPlan] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStartingIntake, setIsStartingIntake] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("interview_id")?.trim();
    setInterviewId(fromQuery || null);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadSavedPlan() {
      if (!interviewId) {
        setPrepPlan(null);
        setIsMissingSavedPlan(false);
        setLoadError(null);
        setIsLoadingPlan(false);
        return;
      }

      setIsLoadingPlan(true);
      setLoadError(null);

      try {
        const data = await getCoachPrepPlan(interviewId);
        if (!isActive) return;
        setPrepPlan(data);
        setIsMissingSavedPlan(false);
      } catch (error) {
        if (!isActive) return;

        if (error instanceof CoachApiError && error.status === 404) {
          setPrepPlan(null);
          setIsMissingSavedPlan(true);
          setLoadError(null);
          return;
        }

        setLoadError(mapLoadError(error));
      } finally {
        if (!isActive) return;
        setIsLoadingPlan(false);
      }
    }

    loadSavedPlan();

    return () => {
      isActive = false;
    };
  }, [interviewId]);

  const planItems = useMemo(() => prepPlan?.plan ?? [], [prepPlan]);
  const hasInterviewId = Boolean(interviewId);
  const canShowWorrySelector = isMissingSavedPlan || (!isLoadingPlan && !prepPlan);
  const canGeneratePlan = hasInterviewId && canShowWorrySelector;

  async function handleGeneratePlan() {
    if (isGenerating) return;
    if (!interviewId) {
      setGenerateError("Please open this page from a selected interview to generate a prep plan.");
      return;
    }

    setGenerateError(null);
    setStartError(null);
    setIsGenerating(true);

    try {
      const data = await createCoachPrepPlan(interviewId, selectedWorry);
      setPrepPlan(data);
      setIsMissingSavedPlan(false);
    } catch (error) {
      setGenerateError(mapGenerateError(error));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleStartIntake() {
    if (!prepPlan?.recommended_first_session?.session_type || isStartingIntake) return;

    setStartError(null);
    setIsStartingIntake(true);

    try {
      await startIntakeSession(prepPlan.recommended_first_session.session_type);
    } catch {
      setStartError("Intake start will be connected in the next integration step.");
    } finally {
      setIsStartingIntake(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-white shadow"
          aria-label="Go back"
        >
          {"<-"}
        </button>

        <div>
          <h1 className="text-3xl font-semibold">Start prep - UX Lead @ Meta</h1>
          <p className="text-gray-500">Thu 2:00 PM - On-site Panel - 8 days away</p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-gray-700">&quot;8 days is a solid runway. Let&apos;s build your prep properly.&quot;</p>

        <div className="mt-4 inline-block rounded-full bg-[#DFF5EF] px-4 py-2 text-sm text-[#0D7C66]">
          This creates a personalized prep plan for this interview
        </div>
      </div>

      {isLoadingPlan ? (
        <div className="mb-6 rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">Loading your prep plan...</div>
      ) : null}

      {loadError ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">{loadError}</div>
      ) : null}

      {!hasInterviewId ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          No interview was selected. Go back to My Interviews and choose an interview to start prep.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">What worries you the most?</h2>

          <div className="space-y-3">
            {WORRY_OPTIONS.map((item) => {
              const isSelected = selectedWorry === item.worryInput;
              return (
                <button
                  type="button"
                  key={item.worryInput}
                  onClick={() => setSelectedWorry(item.worryInput)}
                  className={`w-full rounded-xl border p-4 text-left ${
                    isSelected ? "border-[#0D7C66] bg-[#E8F7F2]" : "border-gray-200"
                  }`}
                  disabled={!canGeneratePlan || isGenerating}
                >
                  <p className="font-medium text-[#1D1D1D]">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </button>
              );
            })}
          </div>

          {canShowWorrySelector ? (
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isGenerating || !hasInterviewId}
              className="mt-6 rounded-xl bg-[#0D7C66] px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating prep plan..." : "Generate prep plan"}
            </button>
          ) : (
            <p className="mt-6 text-sm text-gray-500">Saved plan found. Generate a new one only if you need to refresh it.</p>
          )}

          {generateError ? <p className="mt-3 text-sm text-[#A94442]">{generateError}</p> : null}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Maya&apos;s prep plan</h2>

          {planItems.length > 0 ? (
            <div className="space-y-4">
              {planItems.map((step, index) => (
                <div key={`${step.day}-${step.session_type}-${index}`} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D7C66] text-sm text-white">
                    {step.day}
                  </div>

                  <div>
                    <p className="font-medium text-[#1D1D1D]">{step.task}</p>
                    <p className="text-sm text-gray-500">
                      {step.description} - {step.duration_mins} min
                    </p>
                    <p className="text-xs text-gray-400">session_type: {step.session_type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a worry to generate your personalized plan.</p>
          )}

          {prepPlan?.coach_note ? (
            <div className="mt-5 rounded-xl border border-[#8DD8C4] bg-[#DFF5EF] p-3 text-sm text-[#065F46]">{prepPlan.coach_note}</div>
          ) : null}

          {prepPlan?.recommended_first_session ? (
            <div className="mt-6 rounded-xl bg-[#0B3F35] p-4 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#9BD6C8]">Ready to begin</p>
              <p className="mt-1 text-base">
                Start with {prepPlan.recommended_first_session.session_type.replaceAll("_", " ")} ({prepPlan.recommended_first_session.duration_mins} min)
              </p>
              <p className="mt-1 text-sm text-[#CFE7E0]">{prepPlan.recommended_first_session.reason}</p>
              <button
                type="button"
                onClick={handleStartIntake}
                disabled={isStartingIntake}
                data-session-type={prepPlan.recommended_first_session.session_type}
                className="mt-4 rounded-xl border border-[#7FB8AA] px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStartingIntake ? "Starting..." : "Start intake session ->"}
              </button>
            </div>
          ) : (
            <button className="mt-8 rounded-xl bg-[#0D7C66] px-6 py-3 text-white" disabled>
              Start
            </button>
          )}

          {startError ? <p className="mt-3 text-sm text-[#A94442]">{startError}</p> : null}
        </div>
      </div>
    </div>
  );
}
