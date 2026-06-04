interface Props {
  value: number;
  onChange: (value: number) => void;
}

function getAnxietyContent(score: number) {
  if (score <= 2) {
    return {
      title: "Very calm",
      description: "Little to no anxiety present",
      quote:
        "I feel grounded and confident in my ability to handle this search.",
    };
  }

  if (score <= 4) {
    return {
      title: "Mild anxiety",
      description: "Some nerves, but manageable",
      quote:
        "I notice occasional stress but it isn't affecting my focus.",
    };
  }

  if (score <= 7) {
    return {
      title: "Moderate anxiety",
      description: "present but manageable",
      quote:
        "I notice some tension but I can still focus on what matters.",
    };
  }

  if (score <= 9) {
    return {
      title: "High anxiety",
      description: "frequently affecting confidence",
      quote:
        "Worry is taking up a meaningful amount of my attention.",
    };
  }

  return {
    title: "Overwhelming anxiety",
    description: "significantly impacting daily life",
    quote:
      "The stress feels difficult to manage and is affecting my wellbeing.",
  };
}

export function Step8BaselineAnxiety({
  value,
  onChange,
}: Props) {
  const anxiety = getAnxietyContent(value);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-h2 font-display text-ink mb-4">
          Before your first session — how anxious do you
          feel right now?
        </h2>

        <p className="text-sm text-ink-60 max-w-xl mx-auto">
          Rate your anxiety on a scale of 1 to 10.
          This becomes your baseline score.
          After every session Maya will ask again,
          so you can both see how much things shift
          over time.
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
        <div className="text-center">
          <div className="text-6xl font-bold text-teal-700">
            {value}
          </div>

          <p className="text-sm text-ink mt-2">
            {anxiety.title} — {anxiety.description}
          </p>
        </div>

        <div className="mt-6">
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) =>
              onChange(Number(e.target.value))
            }
            className="w-full accent-teal-600"
          />

          <div className="flex justify-between text-xs text-ink-60 mt-2">
            <span>1 — Completely calm</span>
            <span>10 — Overwhelming</span>
          </div>
        </div>

        <p className="mt-5 text-center italic text-sm text-ink-60">
          "{anxiety.quote}"
        </p>
      </div>

      {/* How Maya Uses This */}
      <div className="bg-white border border-border rounded-2xl p-6 mt-4 shadow-sm">
        <h3 className="font-semibold text-sm mb-4">
          How Maya uses this score
        </h3>

        <div className="space-y-3 text-sm text-ink">
          <div className="flex gap-3">
            <span className="text-teal-600">●</span>
            <p>
              Your score before every session becomes
              the <strong>pre-score</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <span className="text-teal-600">●</span>
            <p>
              After the session, Maya asks again —
              that's your <strong>post-score</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <span className="text-teal-200">●</span>
            <p>
              The difference is your{" "}
              <strong>anxiety lift</strong> —
              the core measure of whether a
              session actually helped
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}