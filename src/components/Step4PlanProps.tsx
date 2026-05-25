interface Step4PlanProps {
  formData: {
    jobRole: string;
    jobStage: string;
    mood: string;
  };
  onComplete?: () => void;
}

// Helper to map mood IDs to readable labels
const MOOD_LABELS: Record<string, string> = {
  "interview-anxiety": "Interview anxiety",
  "overthinking": "Overthinking",
  "rejection": "Handling rejection",
  "burnout": "Burnout recovery",
  "motivation": "Staying motivated",
  "confidence": "Confidence building",
};

export function Step4Plan({ formData, onComplete }: Step4PlanProps) {
  // --- Dynamic Content Generation ---
  
  let dynamicQuote = "We're here to support your career journey every step of the way.";
  let stageTag = "Career search";
  
  switch (formData.jobStage) {
    case "Sending applications":
      dynamicQuote = "You're putting yourself out there. We'll help your applications stand out and manage the anxiety of the wait.";
      stageTag = "Application phase";
      break;
    case "Getting recruiter calls":
      dynamicQuote = `"You're getting recruiter calls — which means your applications are working. We'll help you feel calmer and more confident during high-pressure conversations."`;
      stageTag = "Screening stage";
      break;
    case "In interviews":
      dynamicQuote = "You're in the thick of it. We'll focus on sharpening your responses, calming your nerves, and keeping your head in the game.";
      stageTag = "Interview prep";
      break;
    case "Final rounds / offers":
      dynamicQuote = "You're at the finish line. We'll help you navigate negotiations, weigh your options, and make the best choice with clarity.";
      stageTag = "Offer negotiation";
      break;
      
  }

  // Fallback to the raw string if they typed a custom mood
  const moodTag = MOOD_LABELS[formData.mood] || formData.mood || "Mental fitness"; 
  const roleTag = formData.jobRole && formData.jobRole !== "Open to options" ? formData.jobRole : "Career pivot";

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto w-full">
      
      {/* Icon */}
      <div className="text-2xl mb-4">✨</div>

      {/* Header text */}
      <h1 className="text-[28px] leading-[36px] font-display text-[#171412] mb-2">
        You're already further along than you feel.
      </h1>
      <p className="text-[14px] leading-[18px] font-sans text-[#686460] mb-[32px]">
        Here's what MindGym will focus on for you.
      </p>

      {/* Card Container */}
      <div className="bg-[#FFFFFF] border border-[#E9E9E7] rounded-xl p-[24px] w-full text-left shadow-sm mb-[32px]">
        
        {/* Dynamic Quote */}
        <p className="text-[16px] leading-[24px] font-display text-[#171412] font-medium italic mb-[24px]">
          {dynamicQuote}
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-[8px] pt-[24px] border-t border-[#E9E9E7]">
          {/* Stage Tag */}
          <span className="px-[8px] py-[4px] bg-[#DDF2EE] text-[#126658] rounded text-[10px] leading-[14px] font-sans font-bold">
            {stageTag}
          </span>
          {/* Mood Tag */}
          <span className="px-[8px] py-[4px] bg-[#FFF3DD] text-[#C97A15] rounded text-[10px] leading-[14px] font-sans font-bold">
            {moodTag}
          </span>
          {/* Role/Direction Tag */}
          <span className="px-[8px] py-[4px] bg-[#EDF3FC] text-[#4A6FA5] rounded text-[10px] leading-[14px] font-sans font-bold line-clamp-1 max-w-[200px]">
            {roleTag}
          </span>
        </div>
      </div>

      {/* Call to Action */}
      <button
        onClick={onComplete}
        className="px-[16px] py-[12px] bg-[#126658] text-[#FFFFFF] rounded-lg text-[14px] font-sans font-semibold flex items-center justify-center gap-2 hover:bg-[#0D2B26] transition-colors mb-[16px]"
      >
        Enter Dashboard <span aria-hidden="true">→</span>
      </button>

      {/* Footer Text */}
      <p className="text-[12px] leading-[16px] font-sans text-[#B0AAA6]">
        You can update these at any time in Settings.
      </p>

    </div>
  );
}