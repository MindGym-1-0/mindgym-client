interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  {
    value: "1m",
    label: "1m",
    subtitle: "1 month",
  },
  {
    value: "2m",
    label: "2m",
    subtitle: "2 months",
  },
  {
    value: "3m",
    label: "3m",
    subtitle: "3 months",
  },
  {
    value: "6m",
    label: "6m",
    subtitle: "6 months",
  },
  {
    value: "1y",
    label: "1y",
    subtitle: "1 year",
  },
  {
    value: "1y+",
    label: "1y+",
    subtitle: "Over a year",
  },
];

export function Step2SearchTimeline({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-h2 font-display text-ink">
          How long have you been searching?
        </h2>

        <p className="text-b3 text-ink-60 mt-2 max-w-sm mx-auto">
          No judgment here — this helps Maya calibrate how much
          emotional weight the search might be carrying right now.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`h-24 rounded-xl border transition-all flex flex-col items-center justify-center ${
              value === item.value
                ? "border-teal-600 bg-teal-50"
                : "border-border bg-surface hover:border-teal-300"
            }`}
          >
            <span
              className={`text-xl font-display font-semibold ${
                value === item.value
                  ? "text-teal-700"
                  : "text-ink"
              }`}
            >
              {item.label}
            </span>

            <span className="text-xs text-ink-60 mt-1">
              {item.subtitle}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-teal-600 bg-teal-50 px-4 py-3">
        <p className="text-sm text-teal-800 leading-relaxed">
          Maya will use this to understand the cumulative pressure
          you might be feeling — longer searches often carry more
          emotional weight, and that's completely valid.
        </p>
      </div>
    </div>
  );
}