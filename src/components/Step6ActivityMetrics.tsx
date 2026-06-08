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

const APPLICATION_RANGES = [
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
  const updateCounter = (
    field: ActivityField,
    amount: number
  ) => {
    onChange({
      ...value,
      [field]: Math.max(
        0,
        value[field] + amount
      ),
    });
  };

  const counterRows: {
    field: ActivityField;
    title: string;
    subtitle: string;
  }[] = [
    {
      field: "recruiterCalls",
      title: "Recruiter calls or emails received",
      subtitle: "Inbound interest from recruiters",
    },
    {
      field: "interviews",
      title: "Screening / first-round interviews",
      subtitle:
        "Phone screens, intro calls, video rounds",
    },
    {
      field: "finalRounds",
      title: "On-site / final round interviews",
      subtitle:
        "Panel, technical, or on-site rounds",
    },
    {
      field: "offers",
      title: "Offers received",
      subtitle: "Formal offers in hand",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}

      <div className="text-center mb-8">
        <h2 className="text-h2 font-display text-ink mb-3">
          In the last week, how active have you been?
        </h2>

        <p className="text-sm text-ink-60 max-w-xl mx-auto">
          These numbers help Maya identify your
          hunting gap — the difference between
          effort and outcome — and surface where
          to focus your energy.
        </p>
      </div>

      {/* Main Card */}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Applications Dropdown */}

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="font-medium text-sm text-ink">
              Applications sent
            </p>

            <p className="text-xs text-ink-60 mt-1">
              Total roles applied to
            </p>
          </div>

          <select
            value={value.applications}
            onChange={(e) =>
              onChange({
                ...value,
                applications: Number(
                  e.target.value
                ),
              })
            }
            className="w-40 rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            {APPLICATION_RANGES.map((option) => (
              <option
                key={option.label}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Counter Rows */}

        {counterRows.map((row) => (
          <div
            key={row.field}
            className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
          >
            <div>
              <p className="font-medium text-sm text-ink">
                {row.title}
              </p>

              <p className="text-xs text-ink-60 mt-1">
                {row.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  updateCounter(
                    row.field,
                    -1
                  )
                }
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-lg font-semibold hover:bg-gray-50"
              >
                −
              </button>

              <span className="w-8 text-center font-semibold">
                {value[row.field]}
              </span>

              <button
                type="button"
                onClick={() =>
                  updateCounter(
                    row.field,
                    1
                  )
                }
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-lg font-semibold hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Card */}

      <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p className="font-semibold text-sm text-teal-900 mb-2">
          Maya's early read:
        </p>

        <p className="text-sm text-teal-900">
          You're converting applications to
          screenings at a healthy rate. The gap to
          watch is screening → final round.
          Maya will help strengthen confidence and
          closing momentum in your sessions.
        </p>
      </div>
    </div>
  );
}