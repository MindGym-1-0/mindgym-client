"use client";

import { useEffect, useState } from "react";

const followUps = [
  "In 3 days",
  "In 5 days",
  "In 1 week",
  "When I hear back"
] as const;

export default function AwaitingResponsePage() {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState<(typeof followUps)[number] | null>(followUps[0]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextInterviewId = params.get("interview_id")?.trim();
    setInterviewId(nextInterviewId || null);
  }, []);

  function handleConfirmReminder() {
    if (!selectedFollowUp) return;

    // TODO: connect reminder scheduling when notification/reminder backend is ready.
    setConfirmationMessage(`Reminder preference saved locally: ${selectedFollowUp}.`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-3xl bg-[#F6EAD2] p-10 text-center">
        <div className="mb-5 text-6xl">⏰</div>

        <p className="mb-3 text-sm text-[#9C6B00]">
          Product Designer @ Google
        </p>

        <h1 className="mb-5 text-5xl font-bold text-[#3F2E00]">
          You've done your part.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-[#6B5A2B]">
          The interview is over. Your preparation was real.
          Whatever they decide, you showed up as your best self.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={handleConfirmReminder}
            disabled={!selectedFollowUp}
            className="rounded-xl bg-[#005F56] px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Set a follow-up reminder →
          </button>

          <button type="button" className="rounded-xl border border-[#D6C7A4] px-6 py-3">
            Log how it felt
          </button>
        </div>

        {confirmationMessage ? (
          <p className="mt-4 text-sm text-[#6B5A2B]">{confirmationMessage}</p>
        ) : null}

        {!interviewId ? (
          <p className="mt-3 text-sm text-[#8B5E00]">
            No interview selected. Reminder preference will stay local for now.
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">
            Practical
          </h2>

          <ul className="space-y-3 text-[#4B5563]">
            <li>• If you haven't heard in 5 business days, a polite follow-up is normal.</li>
            <li>• Keep applying elsewhere.</li>
            <li>• Write Maya to draft a follow-up note.</li>
          </ul>
        </div>

        <div className="rounded-3xl bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">
            Emotional
          </h2>

          <ul className="space-y-3 text-[#4B5563]">
            <li>• Anxiety during the wait is normal.</li>
            <li>• The outcome doesn't retroactively change your preparation.</li>
            <li>• A short grounding session can help.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6">
        <h2 className="mb-5 text-2xl font-bold">
          When should Maya check in with you?
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {followUps.map((item) => {
            const isSelected = selectedFollowUp === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSelectedFollowUp(item);
                  setConfirmationMessage(null);
                }}
                className={`rounded-2xl border py-4 transition ${
                  isSelected
                    ? "border-[#0D7C66] bg-[#E6F7F4] text-[#0D7C66]"
                    : "hover:bg-[#E6F7F4]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-[#003B36] p-8 text-white">
        <p className="text-lg italic">
          "While you wait - keep moving forward."
        </p>
      </div>
    </div>
  );
}
