"use client";

import { useEffect, useState } from "react";
import {
  CoachApiError,
  getInterviewChecklist,
  updateInterviewChecklistItem,
} from "../../../../lib/coach/api";
import type { InterviewChecklistResponse } from "../../../../lib/coach/types";

export default function ChecklistPage() {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<InterviewChecklistResponse | null>(null);
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>({});
  const [savingById, setSavingById] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
      setSaveError(null);

      try {
        const data = await getInterviewChecklist(interviewId);
        if (!isActive) return;
        setChecklist(data);
        setCheckedById(
          [...data.mental_prep, ...data.logistics].reduce<Record<string, boolean>>((next, item) => {
            next[item.id] = item.checked;
            return next;
          }, {})
        );
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
  const totalItems = checklist ? checklist.mental_prep.length + checklist.logistics.length : 0;
  const completedItems = totalItems
    ? Object.values(checkedById).filter(Boolean).length
    : readiness?.score ?? 0;
  const progressPct = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : readiness
      ? Math.round((readiness.score / readiness.total_items) * 100)
      : 0;

  function isItemChecked(id: string, initialChecked: boolean) {
    return checkedById[id] ?? initialChecked;
  }

  async function toggleItem(id: string, currentChecked: boolean) {
    if (!interviewId || savingById[id]) return;

    const nextChecked = !currentChecked;
    setSaveError(null);
    setCheckedById((current) => ({
      ...current,
      [id]: nextChecked,
    }));
    setSavingById((current) => ({
      ...current,
      [id]: true,
    }));

    try {
      const result = await updateInterviewChecklistItem(interviewId, id, nextChecked);
      setCheckedById((current) => ({
        ...current,
        [id]: result.checked,
      }));
    } catch {
      setCheckedById((current) => ({
        ...current,
        [id]: currentChecked,
      }));
      setSaveError("We couldn't save that checklist update. Please try again.");
    } finally {
      setSavingById((current) => ({
        ...current,
        [id]: false,
      }));
    }
  }

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

      {saveError ? (
        <div className="mb-6 rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          {saveError}
        </div>
      ) : null}

      {readiness ? (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">Overall readiness</p>
            <p className="font-semibold text-[#0D7C66]">
              {completedItems}/{totalItems || readiness.total_items} Complete
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
            {(checklist?.mental_prep ?? []).map((item) => {
              const checked = isItemChecked(item.id, item.checked);
              const isSaving = Boolean(savingById[item.id]);

              return (
                <button
                  key={item.id}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  aria-disabled={isSaving}
                  disabled={isSaving}
                  onClick={() => void toggleItem(item.id, checked)}
                  className="flex w-full items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                      checked
                        ? "bg-[#0D7C66] text-white"
                        : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {checked ? "✓" : ""}
                  </div>
                  <p className={checked ? "text-gray-700" : "text-gray-400"}>
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Logistics</h2>
            <div className="space-y-4">
              {(checklist?.logistics ?? []).map((item) => {
                const checked = isItemChecked(item.id, item.checked);
                const isSaving = Boolean(savingById[item.id]);

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-disabled={isSaving}
                    disabled={isSaving}
                    onClick={() => void toggleItem(item.id, checked)}
                    className="flex w-full items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                        checked
                          ? "bg-[#0D7C66] text-white"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {checked ? "✓" : ""}
                    </div>
                    <p className={checked ? "text-gray-700" : "text-gray-400"}>
                      {item.label}
                    </p>
                  </button>
                );
              })}
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
