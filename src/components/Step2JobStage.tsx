interface Step2JobStageProps {
  value: string;
  onChange: (value: string) => void;
}

const JOB_STAGES = [
  {
    label: "Sending applications",
    description: "Actively applying, few responses yet",
    emoji: "📱",
  },
  {
    label: "Getting recruiter calls",
    description: "Screening conversations happening",
    emoji: "📞",
  },
  {
    label: "In interviews",
    description: "Technical or panel rounds",
    emoji: "👥",
  },
  {
    label: "Final rounds / offers",
    description: "Negotiating or deciding",
    emoji: "📋",
  },
];

export function Step2JobStage({
  value,
  onChange,
}: Step2JobStageProps) {
  return (
    <div className="space-y-10">
      
      <div className="text-center">
        <h2 className="text-[40px] leading-[48px] font-semibold text-[#171412]">
          Where are you in your search right now?
        </h2>

        <p className="mt-4 text-[16px] text-[#686460]">
          Tap the stage that feels closest.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        
        {JOB_STAGES.map((stage) => (
          <button
            key={stage.label}
            onClick={() => onChange(stage.label)}
            className={`rounded-2xl border p-6 text-left transition-all duration-200 ${
              value === stage.label
                ? "border-[#126658] bg-[#DDF2EE]"
                : "border-[#E7E5E4] bg-white hover:border-[#126658]"
            }`}
          >
            <div className="flex items-start gap-4">
              
              <div className="text-3xl">
                {stage.emoji}
              </div>

              <div>
                <h3 className="text-[16px] font-semibold text-[#171412]">
                  {stage.label}
                </h3>

                <p className="mt-2 text-[14px] leading-6 text-[#686460]">
                  {stage.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}