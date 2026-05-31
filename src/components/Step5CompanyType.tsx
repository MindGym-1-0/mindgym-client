interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  {
    value: "Startup (seed-series B)",
    icon: "🚀",
    title: "Startup (seed-series B)",
    description:
      "Fast-paced environment with broad responsibilities and rapid growth.",
  },
  {
    value: "Scale-up / Growth stage",
    icon: "📈",
    title: "Scale-up / Growth stage",
    description:
      "Growing companies with established products and expanding teams.",
  },
  {
    value: "Large tech / FAANG",
    icon: "💻",
    title: "Large tech / FAANG",
    description:
      "Structured hiring processes, strong compensation, and global impact.",
  },
  {
    value: "Enterprise / Corporate",
    icon: "🏢",
    title: "Enterprise / Corporate",
    description:
      "Established organizations with defined career progression paths.",
  },
  {
    value: "Any company size",
    icon: "🌍",
    title: "Any company size",
    description:
      "I'm open to opportunities regardless of company stage or size.",
  },
];

export function Step5CompanyType({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          What type of company are you targeting?
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          This helps Maya tailor your job-search strategy, interview
          preparation, and networking recommendations.
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
                <div className="flex items-start gap-4">
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
          💡 <strong>Why this matters:</strong> startups, scale-ups,
          and large enterprises often evaluate candidates differently.
          Maya adapts coaching sessions and preparation strategies
          based on the type of organizations you're targeting.
        </p>
      </div>
    </div>
  );
}