interface Step4PlanProps {
  formData: {
    jobRole: string;
    jobStage: string;
    mood: string;
  };
  onComplete?: () => void;
}

const MOOD_LABELS: Record<string, string> = {
  "interview-anxiety": "Interview anxiety",
  overthinking: "Overthinking",
  rejection: "Handling rejection",
  burnout: "Burnout recovery",
  motivation: "Staying motivated",
  confidence: "Confidence building",
};

export function Step4Plan({
  formData,
  onComplete,
}: Step4PlanProps) {
  
  let dynamicQuote =
    "We’re here to support your career journey every step of the way.";

  let stageTag = "Career search";

  switch (formData.jobStage) {
    case "Sending applications":
      dynamicQuote =
        "You’re putting yourself out there. We’ll help your applications stand out and manage the anxiety of waiting.";

      stageTag = "Application phase";
      break;

    case "Getting recruiter calls":
      dynamicQuote =
        "You’re getting recruiter calls — which means your applications are working. We’ll help you feel calmer and more confident during high-pressure conversations.";

      stageTag = "Screening stage";
      break;

    case "In interviews":
      dynamicQuote =
        "You’re in the thick of it. We’ll focus on sharpening your responses, calming nerves, and helping you stay composed.";

      stageTag = "Interview prep";
      break;

    case "Final rounds / offers":
      dynamicQuote =
        "You’re at the finish line. We’ll help you navigate negotiations and make confident decisions with clarity.";

      stageTag = "Offer negotiation";
      break;
  }

  const moodTag =
    MOOD_LABELS[formData.mood] ||
    formData.mood ||
    "Mental fitness";

  const roleTag =
    formData.jobRole &&
    formData.jobRole !== "Open to options"
      ? formData.jobRole
      : "Career direction";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      
      {/* Sparkle */}
      <div className="mb-5 text-2xl">
        ✨
      </div>

      {/* Heading */}
      <h1 className="max-w-xl text-[40px] font-semibold leading-[48px] text-[#171412]">
        You&apos;re already further along than you feel.
      </h1>

      <p className="mt-3 text-sm text-[#686460]">
        Here’s what MindGym will focus on for you.
      </p>

      {/* Summary Card */}
      <div className="mt-10 w-full rounded-2xl border border-[#E7E5E4] bg-white p-8 text-left shadow-sm">
        
        <p className="text-[18px] italic leading-8 text-[#171412]">
          “{dynamicQuote}”
        </p>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#E7E5E4] pt-6">
          
          <span className="rounded-full bg-[#DDF2EE] px-3 py-1 text-xs font-semibold text-[#126658]">
            {stageTag}
          </span>

          <span className="rounded-full bg-[#FFF3DD] px-3 py-1 text-xs font-semibold text-[#C97A15]">
            {moodTag}
          </span>

          <span className="rounded-full bg-[#EDF3FC] px-3 py-1 text-xs font-semibold text-[#4A6FA5]">
            {roleTag}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onComplete}
        className="mt-10 rounded-xl bg-[#126658] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0D4E43]"
      >
        Enter Dashboard →
      </button>

      {/* Footer Text */}
      <p className="mt-5 text-xs text-[#A6A29F]">
        You can update these anytime in Settings.
      </p>
    </div>
  );
}