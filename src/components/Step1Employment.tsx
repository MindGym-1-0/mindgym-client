interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  {
    id: "employed",
    title: "Yes, I'm currently employed",
    description: "I'm exploring opportunities while still in a role",
    emoji: "💼",
  },
  {
    id: "between",
    title: "No, I'm between roles",
    description: "I'm actively searching full-time",
    emoji: "🔍",
  },
  {
    id: "laid_off",
    title: "I was recently laid off",
    description: "My role was eliminated — I'm now searching",
    emoji: "🚩",
  },
];

export function Step1Employment({ value, onChange }: Props) {
  return (
    <div className="space-y-lg">
      <div className="text-center">
        <h2 className="text-h2 font-display text-ink">
          Are you currently employed?
        </h2>
        <p className="text-b2 text-ink-60 mt-sm">
          This helps Maya understand your urgency.
        </p>
      </div>

      <div className="space-y-sm">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`w-full p-base rounded-xl border text-left transition-all ${
              value === option.id
                ? "border-teal-600 bg-teal-50"
                : "border-border bg-surface"
            }`}
          >
            <div className="flex gap-base">
              <span>{option.emoji}</span>
              <div>
                <p className="font-semibold">{option.title}</p>
                <p className="text-b3 text-ink-60">
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}