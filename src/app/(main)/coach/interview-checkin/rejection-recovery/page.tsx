"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSetup, writeSetup } from "@/lib/session/store";

const emotions = [
  "Angry and frustrated",
  "Sad and defeated",
  "Confused",
  "Numb",
  "Honestly, a bit relieved",
];

export default function RejectionRecoveryPage() {
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("interview_id")?.trim() || null;
    setInterviewId(id);
  }, []);

  function handleBeginRecoverySession() {
    if (!interviewId) return;

    clearSetup();
    writeSetup({
      preparation_for: "rejection_recovery",
      interview_id: interviewId,
    });
    router.push("/sessions/setup/emotions");
  }

  const isMissingInterview = !interviewId;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-[#FFECEC] border border-[#F4B5B5] rounded-3xl p-8">
        <p className="text-sm text-[#C53030] mb-2">
          Rejection recovery
        </p>

        <h1 className="text-5xl font-bold text-[#9B1C1C] mb-4">
          You didn&apos;t get the role at Google.
        </h1>

        <p className="text-[#7F1D1D] text-lg">
          That stings. But this doesn&apos;t define what comes next.
        </p>
      </div>

      {isMissingInterview ? (
        <div className="rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
          No interview selected. Open recovery from an interview to start a guided recovery session.
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">
            How are you feeling right now?
          </h2>

          <div className="space-y-4">
            {emotions.map((emotion, index) => (
              <button
                key={index}
                type="button"
                className="w-full border rounded-2xl py-4 px-5 text-left hover:bg-[#FFF5F5]"
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-5">
              What rejection usually means
            </h2>

            <ul className="space-y-3 text-[#4B5563]">
              <li>• Budget freeze or hiring change</li>
              <li>• Internal candidates were prioritized</li>
              <li>• One interviewer focused on a different skill</li>
              <li>• Sometimes they already knew who they wanted</li>
            </ul>
          </div>

          <div className="bg-[#003B36] text-white rounded-3xl p-6">
            <p className="italic mb-6">
              “Every person who has a job they love was rejected before they found it.”
            </p>

            <button
              type="button"
              disabled={isMissingInterview}
              onClick={handleBeginRecoverySession}
              className="bg-[#0D8B7B] px-6 py-3 rounded-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              Begin recovery session →
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#DDF5F1] rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-5">
          Maya&apos;s 3-step recovery
        </h2>

        <ul className="space-y-3 text-[#374151]">
          <li>• Name and release the feeling</li>
          <li>• Today — one small forward action</li>
          <li>• This week — confidence anchor before next interview</li>
        </ul>
      </div>
    </div>
  );
}
