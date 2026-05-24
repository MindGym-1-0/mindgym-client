import { useState } from "react";

interface Step3MoodSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const MOOD_OPTIONS = [
  { id: "interview-anxiety", label: "Interview anxiety", emoji: "😰" },
  { id: "overthinking", label: "Overthinking", emoji: "🔍" },
  { id: "rejection", label: "Rejection", emoji: "💔" },
  { id: "burnout", label: "Burnout", emoji: "😓" },
  { id: "motivation", label: "Staying motivated", emoji: "🔋" },
  { id: "confidence", label: "Confidence", emoji: "💪" },
];

export function Step3MoodSelection({ value, onChange }: Step3MoodSelectionProps) {
  const [customMood, setCustomMood] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(
    value && !MOOD_OPTIONS.some((m) => m.id === value)
  );

  const handleMoodSelect = (moodId: string) => {
    onChange(moodId);
    setCustomMood("");
    setShowCustomInput(false);
  };

  const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
       <h2 className="text-h2 font-display text-ink mb-sm">What&rsquo;s been the hardest part emotionally?</h2>
        <p className="text-b2 text-ink-60">This personalises your coaching sessions.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-base">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`p-base rounded-lg border transition-all duration-200 flex flex-col items-center gap-sm ${
              value === mood.id
                ? "border-teal-600 bg-teal-50"
                : "border-border hover:border-teal-300 hover:bg-background"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className={`text-b3 font-sans font-semibold text-center ${value === mood.id ? "text-ink" : "text-ink-60"}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-base border-t border-border">
        <button
          onClick={handleCustomMoodFocus}
          className={`mb-base px-base py-2 text-b3 font-sans font-semibold rounded-lg transition-all ${
            showCustomInput
              ? "bg-teal-600 text-surface"
              : "bg-background text-ink-60 hover:bg-border"
          }`}
        >
          {showCustomInput ? "Typing custom description..." : "Or describe it in your own words..."}
        </button>

        {showCustomInput && (
          <input
            type="text"
            autoFocus
            placeholder="e.g., Caffeinated, Overwhelmed, Creative..."
            value={customMood}
            onChange={handleCustomMoodChange}
            className="w-full px-base py-2 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-50 text-b2"
          />
        )}
      </div>
    </div>
  );
}
