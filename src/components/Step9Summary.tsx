interface Props {
  formData: any;
  onComplete: () => void;
}

export function Step9Summary({
  formData,
  onComplete,
}: Props) {
  const anxietyLevel =
    formData.anxiety >= 8
      ? "High"
      : formData.anxiety >= 5
      ? "Moderate"
      : "Low";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          Here's what Maya found.
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          Based on your onboarding responses, Maya has identified the
          areas that will have the biggest impact on your job search.
        </p>
      </div>

      {/* Main Insight */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
            🧠
          </div>

          <div>
            <p className="text-sm text-teal-700 font-medium">
              Maya's Assessment
            </p>

            <h3 className="text-xl font-semibold">
              Confidence & Search Momentum
            </h3>
          </div>
        </div>

        <p className="text-ink-70 leading-relaxed">
          Your responses suggest that your biggest opportunity isn't
          necessarily your qualifications — it's maintaining momentum,
          confidence, and consistency throughout the search process.
          Maya will focus on helping you reduce anxiety, improve
          resilience, and approach opportunities with more clarity.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-sm text-ink-60 mb-2">
            Target Role
          </p>

          <h3 className="font-semibold text-lg">
            {formData.role}
          </h3>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-sm text-ink-60 mb-2">
            Preferred Company Type
          </p>

          <h3 className="font-semibold text-lg">
            {formData.companyType}
          </h3>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-sm text-ink-60 mb-2">
            Search Duration
          </p>

          <h3 className="font-semibold text-lg">
            {formData.searchTimeline}
          </h3>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-sm text-ink-60 mb-2">
            Baseline Anxiety
          </p>

          <h3 className="font-semibold text-lg">
            {formData.anxiety}/10 ({anxietyLevel})
          </h3>
        </div>
      </div>

      {/* Emotional Focus */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
        <h3 className="font-semibold text-lg text-teal-900 mb-2">
          Primary Coaching Focus
        </h3>

        <p className="text-teal-900">
          <strong>{formData.emotionalChallenge}</strong>
        </p>

        <p className="mt-3 text-sm text-teal-800">
          Maya will tailor your first sessions around this challenge,
          helping you build confidence, develop coping strategies, and
          create a more sustainable job search process.
        </p>
      </div>

      {/* First Session Preview */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-teal-700 font-medium mb-2">
          Recommended First Session
        </p>

        <h3 className="text-xl font-semibold mb-3">
          Breaking the Stress Cycle
        </h3>

        <p className="text-ink-60">
          Learn practical techniques to reduce anxiety, improve focus,
          and approach interviews and applications with more confidence.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
            Confidence
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
            Anxiety Reduction
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
            Resilience
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onComplete}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
        >
          Begin my first session →
        </button>
      </div>
    </div>
  );
}