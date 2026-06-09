const MAX_SELECTIONS = 2;

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const OPTIONS = [
  {
    value: "Rejection and silence",
    icon: "😔",
    title: "Rejection and silence — the not hearing back",
    description:
      "The waiting and the rejections are chipping away at my confidence",
  },
  {
    value: "Interview anxiety",
    icon: "😰",
    title: "Interview anxiety — I freeze under pressure",
    description:
      "I prepare well but something shuts off when I'm in the room",
  },
  {
    value: "Imposter syndrome",
    icon: "🤔",
    title: "Imposter syndrome — I don't feel good enough",
    description:
      "I second-guess whether I deserve the roles I'm applying for",
  },
  {
    value: "Burnout",
    icon: "😩",
    title: "Burnout — the search itself is exhausting",
    description:
      "The effort of constantly selling myself is draining me",
  },
  {
    value: "Uncertainty",
    icon: "🫤",
    title: "Uncertainty — I don't know what I want",
    description:
      "The hardest part is not knowing which direction is right",
  },
  {
    value: "Financial pressure",
    icon: "💸",
    title: "Financial pressure — the clock is ticking",
    description:
      "Money stress is amplifying everything else",
  },
];

export function Step7EmotionChallenge({ value, onChange }: Props) {
  const atMax = value.length >= MAX_SELECTIONS;

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (!atMax) {
      onChange([...value, option]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-h2 font-display text-ink mb-3">
          What's been the hardest part emotionally?
        </h2>

        <p className="text-sm text-ink-60">
          This personalises your coaching sessions.{" "}
          <span className="text-ink-40">Choose up to 2.</span>
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const selected = value.includes(option.value);
          const disabled = atMax && !selected;

          return (
            <button
              key={option.value}
              onClick={() => toggle(option.value)}
              disabled={disabled}
              className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${
                selected
                  ? "bg-teal-50 border-teal-600"
                  : disabled
                  ? "bg-gray-50 border-border opacity-40 cursor-not-allowed"
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
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selected
                      ? "border-teal-600 bg-teal-600"
                      : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
