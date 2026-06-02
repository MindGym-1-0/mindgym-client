interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  {
    value: "Rejection and silence",
    icon: "📭",
    title: "Rejection and silence",
    description:
      "Applications disappear into a void and responses are rare.",
  },
  {
    value: "Interview anxiety",
    icon: "😰",
    title: "Interview anxiety",
    description:
      "Stress and nerves make it difficult to perform at your best.",
  },
  {
    value: "Imposter syndrome",
    icon: "🤔",
    title: "Imposter syndrome",
    description:
      "Feeling like you're not qualified enough despite your experience.",
  },
  {
    value: "Burnout",
    icon: "🔥",
    title: "Burnout",
    description:
      "The job search is draining your energy and motivation.",
  },
  {
    value: "Uncertainty",
    icon: "🌫️",
    title: "Uncertainty",
    description:
      "Not knowing what to do next or whether you're on the right path.",
  },
  {
    value: "Financial pressure",
    icon: "💸",
    title: "Financial pressure",
    description:
      "The need for income is adding urgency and stress.",
  },
];

export function Step7EmotionChallenge({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          What's been the hardest part emotionally?
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          Everyone struggles with different parts of the job search.
          Maya uses this to personalize coaching and identify where
          support will have the biggest impact.
        </p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`w-full rounded-2xl border p-5 transition-all text-left ${
                selected
                  ? "border-teal-600 bg-teal-50 shadow-sm"
                  : "border-border bg-white hover:border-teal-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="text-2xl">
                    {option.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {option.title}
                    </h3>

                    <p className="text-sm text-ink-60 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected
                      ? "border-teal-600"
                      : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm text-teal-900">
          💡 <strong>Why this matters:</strong> Maya doesn't just help
          you find a job. She helps you navigate the emotional side of
          the process so you can stay confident, focused, and resilient
          throughout your search.
        </p>
      </div>
    </div>
  );
}