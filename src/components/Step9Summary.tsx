"use client";

interface FormData {
  employmentStatus: string;
  searchTimeline: string;
  targetTimeline: string;
  role: string;
  companyType: string;
  activity: {
    applications: number;
    recruiterCalls: number;
    interviews: number;
    finalRounds: number;
    offers: number;
  };
  emotionalChallenge: string;
  anxiety: number;
}

interface Props {
  formData: FormData;
  onComplete: () => void;
  onDashboard: () => void;
  isLoading?: boolean;
}

export function Step9Summary({
  formData,
  onComplete,
  onDashboard,
  isLoading = false,
}: Props) {

  const anxietyLevel =
    formData.anxiety >= 8
      ? "High"
      : formData.anxiety >= 5
      ? "Moderate"
      : "Low";

  const mindsetMap: Record<string, string> = {
    "Rejection and silence": "Rejection sensitivity",
    "Interview anxiety": "Interview confidence",
    "Imposter syndrome": "Self-belief gap",
    Burnout: "Energy depletion",
    Uncertainty: "Direction uncertainty",
    "Financial pressure": "Pressure overload",
  };

  const sessionMap: Record<string, string> = {
    "Rejection and silence":
      "Envisioning success — breaking the rejection spiral",

    "Interview anxiety":
      "Visualising calm — entering interviews with confidence",

    "Imposter syndrome":
      "Rewriting self-belief — owning your strengths",

    Burnout:
      "Restoring momentum — recovering from job search fatigue",

    Uncertainty:
      "Finding direction — creating clarity and focus",

    "Financial pressure":
      "Reducing pressure — regaining a sense of control",
  };

  const applications =
    formData.activity?.applications || 0;

  const interviews =
    formData.activity?.interviews || 0;

  const finalRounds =
    formData.activity?.finalRounds || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#042E2B]/90 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-6" />
          <p className="text-white text-lg font-semibold">Please hold on</p>
          <p className="text-white/70 text-sm mt-1">Your session is about to begin…</p>
        </div>
      )}
      {/* Header */}

      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          Here's what Maya found.
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          Based on your answers, Maya has identified
          your key gaps and built your first session
          around them.
        </p>
      </div>

      {/* Gap Analysis */}

      <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-ink-60 mb-4">
          Maya&apos;s gap analysis
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Mindset Gap */}

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-medium text-red-700 mb-2">
              Mindset gap
            </p>

            <h3 className="font-semibold text-red-700 mb-2">
              {mindsetMap[
                formData.emotionalChallenge
              ] || "Confidence gap"}
            </h3>

            <p className="text-sm text-red-700">
              The silence and rejections are eroding
              confidence faster than new applications
              are rebuilding it.
            </p>
          </div>

          {/* Hunting Gap */}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700 mb-2">
              Hunting gap
            </p>

            <h3 className="font-semibold text-amber-700 mb-2">
              Screening → Final round conversion
            </h3>

            <p className="text-sm text-amber-700">
              {applications} applications →{" "}
              {interviews} screenings →{" "}
              {finalRounds} final rounds.
              The bottleneck is at the final stage,
              not application volume.
            </p>
          </div>
        </div>

        {/* Anxiety Card */}

        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4">
          <h3 className="font-semibold text-teal-900 mb-2">
            Your baseline anxiety:{" "}
            {formData.anxiety}/10
          </h3>

          <p className="text-sm text-teal-900">
            {anxietyLevel} — you have capacity to
            work. Maya will aim to get this to 2–3
            through consistent session work. Every
            session records a pre and post score so
            you can track the real change.
          </p>
        </div>
      </div>

      {/* First Session Card */}

      <div className="rounded-3xl bg-gradient-to-r from-[#042E2B] to-[#0A4D45] p-8 text-white">
        <p className="text-xs opacity-70 mb-3">
          Your first session
        </p>

        <h3 className="text-3xl font-semibold mb-4">
          {sessionMap[
            formData.emotionalChallenge
          ] ||
            "Envisioning success — breaking the rejection spiral"}
        </h3>

        <p className="text-sm leading-relaxed text-white/80 max-w-2xl">
          A 10-minute guided visualisation session.
          Maya will walk you through rebuilding
          confidence, reducing emotional fatigue,
          and creating momentum for your next
          opportunity.
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="px-3 py-1 rounded-md bg-white/10 text-xs">
            10 minutes
          </span>

          <span className="px-3 py-1 rounded-md bg-white/10 text-xs">
            Visualisation
          </span>

          <span className="px-3 py-1 rounded-md bg-white/10 text-xs">
            Recovery
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-2 flex flex-col gap-3">
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="w-full bg-[#0F766E] hover:bg-[#0D6B64] text-white py-4 rounded-2xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Begin my first session →
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onDashboard}
            className="text-sm text-gray-500 underline hover:text-gray-800"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}