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
];

export function Step4RoleDirection({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          What kind of role are you aiming for?
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          Maya uses this to tailor examples, interview preparation,
          and coaching sessions around your specific career goals.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {CHIPS.map((chip) => {
          const selected = value === chip;

          return (
            <button
              key={chip}
              onClick={() => onChange(chip)}
              className={`px-5 py-3 rounded-full border transition-all font-medium ${
                selected
                  ? "bg-teal-50 border-teal-600 text-teal-700 shadow-sm"
                  : "bg-white border-border hover:border-teal-300"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <label className="block text-sm font-medium mb-2">
          Or enter a specific role
        </label>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Senior UX Lead, AI Product Manager, Frontend Engineer"
          className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <p className="text-sm text-ink-60 mt-2">
          Don't worry if your title isn't listed above.
        </p>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm text-teal-900">
          💡 <strong>Why this matters:</strong> a Product Manager,
          Software Engineer, and Marketing Lead often face completely
          different hiring processes. Maya adapts interview practice,
          coaching sessions, and job-search strategies accordingly.
        </p>
      </div>
    </div>
  );
}