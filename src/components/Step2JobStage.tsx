interface Step2JobStageProps {
  value: string;
  onChange: (value: string) => void;
}

const JOB_STAGES = [
  { label: "Sending applications", description: "Actively applying, few responses yet", emoji: "📱" },
  { label: "Getting recruiter calls", description: "Screening conversations happening", emoji: "📞" },
  { label: "In interviews", description: "Technical or panel rounds", emoji: "👥" },
  { label: "Final rounds / offers", description: "Negotiating or deciding", emoji: "📋" },
];

export function Step2JobStage({ value, onChange }: Step2JobStageProps) {
  return (
    <div className="space-y-md">
      <div>
        <h2 className="text-h2 font-display text-ink mb-sm">Where are you in your search right now?</h2>
        <p className="text-b2 text-ink-60">Tap the stage that feels closest.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-base">
        {JOB_STAGES.map((stage) => (
          <button
            key={stage.label}
            onClick={() => onChange(stage.label)}
            className={`p-base border rounded-lg text-left transition-all duration-200 ${
              value === stage.label
                ? "border-teal-600 bg-teal-50"
                : "border-border hover:border-teal-300 hover:bg-background"
            }`}
          >
            <div className="flex items-start gap-base">
              <span className="text-2xl flex-shrink-0">{stage.emoji}</span>
              <div>
                <p className="font-sans font-semibold text-ink text-b2">{stage.label}</p>
                <p className="text-b3 text-ink-60 mt-1">{stage.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
