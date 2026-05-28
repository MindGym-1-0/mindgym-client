import { useState } from "react";

interface Step3MoodSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const MOOD_OPTIONS = [
  {
    id: "interview-anxiety",
    label: "Interview anxiety",
    emoji: "😰",
  },
  {
    id: "overthinking",
    label: "Overthinking",
    emoji: "🔍",
  },
  {
    id: "rejection",
    label: "Rejection",
    emoji: "💔",
  },
  {
    id: "burnout",
    label: "Burnout",
    emoji: "😓",
  },
  {
    id: "motivation",
    label: "Staying motivated",
    emoji: "🔋",
  },
  {
    id: "confidence",
    label: "Confidence",
    emoji: "💪",
  },
];

export function Step3MoodSelection({
  value,
  onChange,
}: Step3MoodSelectionProps) {
  const [customMood, setCustomMood] =
    useState("");

  const [showCustomInput, setShowCustomInput] =
    useState(
      value &&
        !MOOD_OPTIONS.some(
          (m) => m.id === value
        )
    );

  const handleMoodSelect = (
    moodId: string
  ) => {
    onChange(moodId);

    setCustomMood("");

    setShowCustomInput(false);
  };

  const handleCustomMoodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMood = e.target.value;

    setCustomMood(newMood);

    onChange(newMood);
  };

  const handleCustomMoodFocus = () => {
    setShowCustomInput(true);

    onChange("");
  };

  return (
    <div className="space-y-lg">
      <div>
        <h2 className="text-h2 font-display text-ink mb-sm">What's been the hardest part emotionally?</h2>
        <p className="text-b2 text-ink-60">This personalises your coaching sessions.</p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() =>
              handleMoodSelect(mood.id)
            }
            className={`min-h-[120px] rounded-2xl border p-5 transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
              value === mood.id
                ? "border-[#126658] bg-[#DDF2EE]"
                : "border-[#E7E5E4] bg-white hover:border-[#126658]"
            }`}
          >
            <span className="text-3xl">
              {mood.emoji}
            </span>

            <span
              className={`text-[14px] font-medium text-center ${
                value === mood.id
                  ? "text-[#171412]"
                  : "text-[#686460]"
              }`}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-[#E7E5E4]">
        
        <button
          onClick={handleCustomMoodFocus}
          className={`mb-5 rounded-xl px-5 py-3 text-[14px] font-medium transition-all ${
            showCustomInput
              ? "bg-[#126658] text-white"
              : "bg-[#F3F3F2] text-[#686460] hover:bg-[#E7E5E4]"
          }`}
        >
          {showCustomInput
            ? "Typing custom description..."
            : "Or describe it in your own words..."}
        </button>

        {showCustomInput && (
          <input
            type="text"
            autoFocus
            placeholder="Describe how you feel..."
            value={customMood}
            onChange={
              handleCustomMoodChange
            }
            className="w-full rounded-2xl border border-[#126658] bg-white px-5 py-4 text-[15px] outline-none"
          />
        )}
      </div>
    </div>
  );
}