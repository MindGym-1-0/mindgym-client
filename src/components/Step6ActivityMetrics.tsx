interface ActivityData {
  applications: number;
  recruiterCalls: number;
  interviews: number;
  finalRounds: number;
  offers: number;
}

interface Props {
  value: ActivityData;
  onChange: (value: ActivityData) => void;
}

type ActivityField = keyof ActivityData;

export function Step6ActivityMetrics({
  value,
  onChange,
}: Props) {
  const update = (
    field: ActivityField,
    amount: number
  ) => {
    onChange({
      ...value,
      [field]: Math.max(0, value[field] + amount),
    });
  };

  const rows: [ActivityField, string, string][] = [
    [
      "applications",
      "Applications sent",
      "Jobs you've applied to",
    ],
    [
      "recruiterCalls",
      "Recruiter calls",
      "Initial recruiter conversations",
    ],
    [
      "interviews",
      "Screening interviews",
      "First-round or screening interviews",
    ],
    [
      "finalRounds",
      "Final-round interviews",
      "Panel, onsite, or final rounds",
    ],
    [
      "offers",
      "Offers received",
      "Verbal or written offers",
    ],
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          How active has your search been recently?
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          These numbers help Maya understand whether your challenge is
          confidence, strategy, interview performance, or search volume.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        {rows.map(([field, title, description]) => (
          <div
            key={field}
            className="flex items-center justify-between border border-border rounded-xl p-4"
          >
            <div>
              <h3 className="font-semibold text-base">
                {title}
              </h3>

              <p className="text-sm text-ink-60 mt-1">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => update(field, -1)}
                className="w-10 h-10 rounded-full border border-border hover:bg-gray-50 text-lg font-semibold"
              >
                −
              </button>

              <span className="w-10 text-center text-xl font-semibold">
                {value[field]}
              </span>

              <button
                type="button"
                onClick={() => update(field, 1)}
                className="w-10 h-10 rounded-full border border-border hover:bg-gray-50 text-lg font-semibold"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm text-teal-900">
          💡 <strong>Why this matters:</strong> Maya uses your recent
          activity levels to identify whether the biggest opportunity
          lies in increasing application volume, improving interview
          performance, strengthening networking efforts, or building
          confidence throughout the process.
        </p>
      </div>
    </div>
  );
}