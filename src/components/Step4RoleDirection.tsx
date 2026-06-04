interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CHIPS = [
  "Product Design / UX",
  "Product Management",
  "Software Engineering",
  "Data / Analytics",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "People / HR",
  "Leadership / Executive",
  "I'm not sure yet",
];

export function Step4RoleDirection({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-h2 font-display text-ink mb-3">
          What kind of role are you aiming for?
        </h2>

        <p className="text-sm text-ink-60">
          No need to be specific — a direction is enough.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {CHIPS.map((chip) => {
          const selected = value === chip;

          return (
            <button
              key={chip}
              onClick={() => onChange(chip)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                selected
                  ? "bg-teal-50 border-teal-600 text-teal-700"
                  : "bg-white border-border text-ink-70 hover:border-teal-300"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div>
        <p className="text-xs font-medium text-ink-60 mb-2">
          Or describe it in your own words:
        </p>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Senior UX Lead, Head of Growth..."
          className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
}