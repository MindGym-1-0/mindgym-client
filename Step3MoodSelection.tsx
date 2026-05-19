import { useState } from "react";

interface Step3MoodSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const MOOD_OPTIONS = [
  { id: "calm", label: "Calm", emoji: "😌", color: "bg-green-100 border-green-400" },
  { id: "focused", label: "Focused", emoji: "😊", color: "bg-blue-100 border-blue-400" },
  { id: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-100 border-gray-400" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "bg-orange-100 border-orange-400" },
  { id: "stressed", label: "Stressed", emoji: "😟", color: "bg-red-100 border-red-400" },
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">How's your mood right now?</h2>
        <p className="text-lg text-gray-600">Pick a mood or describe how you're feeling.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === mood.id
                ? `${mood.color} border-current shadow-md`
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className={`text-sm font-semibold ${value === mood.id ? "text-gray-900" : "text-gray-700"}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleCustomMoodFocus}
          className={`mb-3 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            showCustomInput
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {showCustomInput ? "Typing custom mood..." : "Or describe your mood"}
        </button>

        {showCustomInput && (
          <input
            type="text"
            autoFocus
            placeholder="E.g., Caffeinated, Overwhelmed, Creative..."
            value={customMood}
            onChange={handleCustomMoodChange}
            className="w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 text-lg"
          />
        )}
      </div>
    </div>
  );
}
