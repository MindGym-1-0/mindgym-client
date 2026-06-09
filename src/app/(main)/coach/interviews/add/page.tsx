// src/app/(main)/coach/interviews/add/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoachApiError, createInterview } from "../../../../../lib/coach/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const EVENT_TYPES = [
  { value: "video_call", label: "Video call" },
  { value: "phone_screen", label: "Phone screen" },
  { value: "onsite", label: "On-site" },
  { value: "panel", label: "Panel" },
  { value: "technical", label: "Technical" },
  { value: "final_round", label: "Final round" },
];

export default function AddInterviewPage() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0].value);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTierLimitError, setIsTierLimitError] = useState(false);

  async function handleSave() {
    if (!company.trim() || !role.trim() || !interviewDate) {
      setError("Company, role, and interview date are required.");
      return;
    }

    setError(null);
    setIsTierLimitError(false);
    setIsSaving(true);

    try {
      await createInterview({
        company: company.trim(),
        role: role.trim(),
        interview_date: new Date(interviewDate).toISOString(),
        event_type: eventType,
        notes: notes.trim() || undefined,
      });
      router.push("/coach/interviews");
    } catch (err) {
      if (err instanceof CoachApiError && err.status === 403) {
        setIsTierLimitError(true);
        setError("You've reached your interview limit. Upgrade your plan to continue.");
      } else if (err instanceof CoachApiError && err.status >= 500) {
        setError("Couldn't save the interview right now. Please try again shortly.");
      } else {
        setError("Couldn't save the interview. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          ←
        </button>
        <h1 className="text-3xl font-semibold">Add interview</h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-5">

        {error && (
          <div>
            {isTierLimitError ? (
              <div className="rounded-xl border border-[#FFA500] bg-[#FFF8E6] p-4">
                <div className="flex gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#8B5A00] mb-2">Interview limit reached</h3>
                    <p className="text-sm text-[#8B5A00] mb-3">{error}</p>
                    <Link
                      href="/settings"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#FF8C00] hover:text-[#E67E00] transition"
                    >
                      View plans & upgrade
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#F2C879] bg-[#FFF5E6] p-4 text-sm text-[#8B5E00]">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Interview details */}
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
          <h2 className="font-semibold text-[#1D1D1D]">Interview details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company <span className="text-[#A94442]">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#0D7C66]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role <span className="text-[#A94442]">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Product Designer"
              className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#0D7C66]"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interview date & time <span className="text-[#A94442]">*</span>
              </label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#0D7C66]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interview type <span className="text-[#A94442]">*</span>
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#0D7C66]"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific details or job description links here..."
              className="mt-2 h-32 w-full resize-none rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-[#0D7C66]"
            />
          </div>
        </div>

        {/* File upload — coming soon */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-[#1D1D1D]">
            Attach a file <span className="text-sm font-normal text-gray-400">(optional)</span>
          </h2>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">
            <div className="text-4xl mb-3">📤</div>
            <p className="font-medium text-gray-700">Choose a file or drag and drop it here</p>
            <p className="mt-1 text-sm text-gray-400">JPEG, PNG, PDF up to 30MB</p>
            <button
              type="button"
              disabled
              className="mt-5 rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-400 cursor-not-allowed"
            >
              Browse file
            </button>
            <p className="mt-3 text-xs text-gray-400">File upload coming soon</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-[#0D7C66] px-6 py-3 text-white hover:bg-[#095c4c] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Interview"}
          </button>
        </div>

      </div>
    </div>
  );
}