interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  {
    value: "As soon as possible",
    icon: "⚡",
    title: "As soon as possible",
    description: "I need to move quickly — urgency is high",
  },
  {
    value: "Within 3 months",
    icon: "📅",
    title: "Within 3 months",
    description: "I have a reasonable runway but want to move steadily",
  },
  {
    value: "Within 6 months",
    icon: "🗓️",
    title: "Within 6 months",
    description: "I can be selective — no immediate financial pressure",
  },
  {
    value: "Within 12 months",
    icon: "🌱",
    title: "Within 12 months",
    description: "I'm exploring longer term — currently in a role I'm not leaving urgently",
  },
];

export function Step3TargetTimeline({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          What's your ideal timeline to find your next role?
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          Combined with your employment status, this tells Maya how
          much urgency you're carrying and helps her personalize
          coaching accordingly.
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
          💡 <strong>Why this matters:</strong> someone between jobs
          with an ASAP timeline experiences a very different level of
          pressure than someone currently employed and exploring
          opportunities over the next 12 months. Maya adapts her
          coaching style based on this context.
        </p>
      </div>
    </div>
  );
}