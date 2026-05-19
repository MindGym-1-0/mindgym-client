interface Step2JobStageProps {
  value: string;
  onChange: (value: string) => void;
}

const JOB_STAGES = [
  { label: "Sending applications", description: "Actively applying, few responses yet", emoji: "📱" },
  { label: "Getting recruiter calls", description: "Getting outreach, early conversations happening", emoji: "📞" },
  { label: "In interviews", description: "Technical or panel rounds", emoji: "👥" },
  { label: "Final rounds / offers", description: "Negotiating or deciding", emoji: "📋" },
];

export function Step2JobStage({ value, onChange }: Step2JobStageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Where are you in your search right now?</h2>
        <p className="text-lg text-gray-600">Pick the stage that feels closest.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JOB_STAGES.map((stage) => (
          <button
            key={stage.label}
            onClick={() => onChange(stage.label)}
            className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
              value === stage.label
                ? "border-teal-600 bg-teal-50 shadow-md"
                : "border-gray-300 hover:border-teal-400 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{stage.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900">{stage.label}</p>
                <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
