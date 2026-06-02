interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = ["1m", "2m", "3m", "6m", "1y", "1y+"];

export function Step2SearchTimeline({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-lg">
      <div className="text-center">
        <h2 className="text-h2 font-display">
          How long have you been searching?
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-base max-w-md mx-auto">
        {OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`p-base rounded-xl border ${
              value === item
                ? "bg-teal-50 border-teal-600"
                : "border-border"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}