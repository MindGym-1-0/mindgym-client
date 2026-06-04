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

const RANGE_OPTIONS = [
  { label: "0 - 05", value: 0 },
  { label: "05 - 10", value: 5 },
  { label: "10 - 20", value: 10 },
  { label: "20 - 40", value: 20 },
  { label: "40 - 50", value: 40 },
  { label: "50+", value: 50 },
];

export function Step6ActivityMetrics({
  value,
  onChange,
}: Props) {
  const rows: {
    field: ActivityField;
    title: string;
    subtitle: string;
  }[] = [
    {
      field: "applications",
      title: "Applications sent",
      subtitle: "Total roles applied to",
    },
    {
      field: "recruiterCalls",
      title: "Recruiter calls or emails received",
      subtitle: "Inbound interest from recruiters",
    },
    {
      field: "interviews",
      title: "Screening / first-round interviews",
      subtitle: "Phone screens, intro calls, video rounds",
    },
    {
      field: "finalRounds",
      title: "On-site / final round interviews",
      subtitle: "Panel, technical, or on-site rounds",
    },
    {
      field: "offers",
      title: "Offers received",
      subtitle: "Formal offers in hand",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-h2 font-display text-ink mb-3">
          In the last week, how active have you been?
        </h2>

        <p className="text-sm text-ink-60 max-w-xl mx-auto">
          These numbers help Maya identify your hunting gap — the
          difference between effort and outcome — and surface where
          to focus your energy.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {rows.map((row, index) => (
          <div
            key={row.field}
            className={`flex items-center justify-between px-5 py-4 ${
              index !== rows.length - 1
                ? "border-b border-border"
                : ""
            }`}
          >
            <div>
              <p className="font-medium text-sm text-ink">
                {row.title}
              </p>

              <p className="text-xs text-ink-60 mt-1">
                {row.subtitle}
              </p>
            </div>

            <select
              value={value[row.field]}
              onChange={(e) =>
                onChange({
                  ...value,
                  [row.field]: Number(e.target.value),
                })
              }
              className="w-40 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            >
              {RANGE_OPTIONS.map((option) => (
                <option
                  key={option.label}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p className="font-semibold text-sm text-teal-900 mb-2">
          Maya's early read:
        </p>

        <p className="text-sm text-teal-900">
          You're converting applications to screenings at
          a healthy rate. The biggest opportunity may be
          improving final-round performance and closing
          momentum.
        </p>
      </div>
    </div>
  );
}