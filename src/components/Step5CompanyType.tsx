interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  {
    value: "Startup",
    icon: "🚀",
    title: "Startup (seed – Series B)",
    description:
      "Fast-moving, generalist roles, less structured interviews",
  },
  {
    value: "Scale-up",
    icon: "📈",
    title: "Scale-up / Growth stage",
    description:
      "Structured enough to have process, fast enough to still matter individually",
  },
  {
    value: "FAANG",
    icon: "🏢",
    title: "Large tech / FAANG",
    description:
      "Structured panels, behavioural loops, strong process — high competition",
  },
  {
    value: "Enterprise",
    icon: "🏛️",
    title: "Enterprise / Traditional corporate",
    description:
      "Longer processes, hierarchical, stability-focused culture",
  },
  {
    value: "Any",
    icon: "🌍",
    title: "Any company size is fine",
    description:
      "I'm open — fit and role matter more than company stage",
  },
];

export function Step5CompanyType({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-h2 font-display text-ink mb-3">
          What type of company do you want to work for?
        </h2>

        <p className="text-sm text-ink-60 max-w-xl mx-auto">
          Interview culture, prep approach, and the psychological
          weight of a process varies a lot by company type.
          You can pick more than one.
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${
                selected
                  ? "bg-teal-50 border-teal-600"
                  : "bg-white border-border hover:border-teal-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {option.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-ink">
                      {option.title}
                    </h3>

                    <p className="text-xs text-ink-60 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected
                      ? "border-teal-600"
                      : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <div className="w-3 h-3 rounded-full bg-teal-600" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}