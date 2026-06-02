interface Props {
  value: number;
  onChange: (value: number) => void;
}

function getAnxietyLabel(score: number) {
  if (score <= 2) {
    return {
      title: "Very calm",
      description:
        "You're feeling confident and relatively stress-free.",
      quote:
        "I feel prepared and in control of my job search.",
    };
  }

  if (score <= 4) {
    return {
      title: "Mild anxiety",
      description:
        "Some nerves are present, but they're manageable.",
      quote:
        "I notice some stress, but it isn't holding me back.",
    };
  }

  if (score <= 7) {
    return {
      title: "Moderate anxiety",
      description:
        "Anxiety is noticeable and may affect confidence or focus.",
      quote:
        "I notice tension, but I can still focus on what matters.",
    };
  }

  if (score <= 9) {
    return {
      title: "High anxiety",
      description:
        "Stress is having a meaningful impact on your search experience.",
      quote:
        "I spend a lot of energy worrying about outcomes.",
    };
  }

  return {
    title: "Overwhelming anxiety",
    description:
      "The job search feels emotionally exhausting right now.",
    quote:
      "The pressure feels difficult to manage on my own.",
  };
}

export function Step8BaselineAnxiety({
  value,
  onChange,
}: Props) {
  const anxiety = getAnxietyLabel(value);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-ink mb-3">
          Before your first session — how anxious do you feel?
        </h2>

        <p className="text-ink-60 max-w-2xl mx-auto">
          Rate your anxiety on a scale from 1 to 10. This becomes your
          baseline score so Maya can measure progress over time.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-8">
        <div className="text-center">
          <div className="text-7xl font-bold text-teal-700">
            {value}
          </div>

          <h3 className="text-xl font-semibold mt-3">
            {anxiety.title}
          </h3>

          <p className="text-ink-60 mt-2">
            {anxiety.description}
          </p>
        </div>

        <div className="mt-8">
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) =>
              onChange(Number(e.target.value))
            }
            className="w-full cursor-pointer"
          />

          <div className="flex justify-between text-sm text-ink-60 mt-2">
            <span>1 — Completely calm</span>
            <span>10 — Overwhelming</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <p className="italic text-center text-ink-60">
            "{anxiety.quote}"
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
        <h3 className="font-semibold text-lg text-teal-900 mb-3">
          How Maya uses this score
        </h3>

        <div className="space-y-3 text-sm text-teal-900">
          <p>
            • Your score before every session becomes your baseline.
          </p>

          <p>
            • After the session, Maya asks for your score again.
          </p>

          <p>
            • The difference helps measure anxiety reduction and
            emotional progress over time.
          </p>

          <p>
            • Over multiple sessions, you'll see how confidence,
            resilience, and interview readiness improve.
          </p>
        </div>
      </div>
    </div>
  );
}