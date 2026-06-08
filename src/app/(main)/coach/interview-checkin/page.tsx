"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachApiError, updateInterviewOutcome } from "../../../../lib/coach/api";
import type { InterviewOutcome } from "../../../../lib/coach/types";

type OutcomeOption = {
  title: string;
  description: string;
  emoji: string;
  route: string;
  border: string;
  outcome: InterviewOutcome;
};

const options: OutcomeOption[] = [
  {
    title: "I got the job",
    description: "I received an offer, or I'm expecting one very soon.",
    emoji: "Celebration",
    route: "/coach/interview-checkin/got-job",
    border: "border-[#9EE5D8]",
    outcome: "offer"
  },
  {
    title: "Still waiting to hear back",
    description: "I haven't had a response yet. The limbo is real.",
    emoji: "Waiting",
    route: "/coach/interview-checkin/awaiting-response",
    border: "border-[#E9E3D5]",
    outcome: "awaiting"
  },
  {
    title: "I didn't get the role",
    description: "I received a rejection, or I could tell during the interview it didn't go well.",
    emoji: "Rejection",
    route: "/coach/interview-checkin/rejection-recovery",
    border: "border-[#F2CACA]",
    outcome: "no_offer"
  }
];

function mapOutcomeError(error: unknown) {
  if (error instanceof CoachApiError && error.status >= 500) {
    return "We couldn't save your check-in right now. Please try again shortly.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "We couldn't save your check-in. Please try again.";
}

export default function InterviewCheckinPage() {
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextInterviewId = params.get("interview_id")?.trim();
    setInterviewId(nextInterviewId || null);
  }, []);

  async function handleOutcomeSelect(option: OutcomeOption) {
    if (!interviewId || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await updateInterviewOutcome(interviewId, option.outcome);
      router.push(`${option.route}?interview_id=${interviewId}`);
    } catch (nextError) {
      setError(mapOutcomeError(nextError));
      setIsSubmitting(false);
    }
  }

  async function handleNotReady() {
    if (!interviewId || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await updateInterviewOutcome(interviewId, "pending");
      router.push("/coach/interviews");
    } catch (nextError) {
      setError(mapOutcomeError(nextError));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="mb-3 text-5xl font-bold text-[#1A1A1A]">
          How did it go?
        </h1>

        <p className="text-lg text-[#6B7280]">
          Your answer helps Maya understand what you're carrying right now.
        </p>
      </div>

      {!interviewId ? (
        <div className="mb-6 rounded-2xl border border-[#F2C879] bg-[#FFF5E6] px-4 py-3 text-sm text-[#8B5E00]">
          No interview selected. Please open check-in from an interview.
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-2xl border border-[#F2C879] bg-[#FFF5E6] px-4 py-3 text-sm text-[#8B5E00]">
          {error}
        </div>
      ) : null}

      <div className="space-y-6">
        {options.map((option) => (
          <button
            key={option.route}
            type="button"
            onClick={() => void handleOutcomeSelect(option)}
            disabled={!interviewId || isSubmitting}
            className={`flex w-full items-center justify-between rounded-3xl border ${option.border} bg-white p-6 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F6F4] text-sm font-medium text-[#4B5563]">
                {option.emoji}
              </div>

              <div className="text-left">
                <h2 className="mb-1 text-2xl font-semibold text-[#1A1A1A]">
                  {option.title}
                </h2>

                <p className="text-[#6B7280]">
                  {option.description}
                </p>
              </div>
            </div>

            <span className="text-2xl text-[#9CA3AF]">
              {isSubmitting ? "..." : "->"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={() => void handleNotReady()}
          disabled={!interviewId || isSubmitting}
          className="rounded-full border border-[#D1D5DB] px-6 py-3 text-[#6B7280] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Not ready to talk about it yet"}
        </button>

        <p className="mt-3 text-sm text-[#9CA3AF]">
          Maya will check in again tomorrow.
        </p>
      </div>
    </div>
  );
}
