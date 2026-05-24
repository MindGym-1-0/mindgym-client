interface Step1JobRoleProps {
  value: string;
  onChange: (value: string) => void;
}

const JOB_ROLES = [
  "Large tech company",
  "Remote-first startup",
  "Mission-driven company",
  "Agency or studio",
  "Open to options",
];

export function Step1JobRole({ value, onChange }: Step1JobRoleProps) {
  return (
    <div className="space-y-md">
      <div>
        <h2 className="text-h2 font-display text-ink mb-sm">What kind of role are you aiming for?</h2>
        <p className="text-b2 text-ink-60 mb-md">No need to be specific — a direction is enough.</p>
      </div>
      <input
        type="text"
        className="w-full px-base py-2 border border-border rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-50 transition-all text-b2 placeholder-ink-30"
        placeholder="e.g. Product Designer, Software Engineer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-sm pt-base">
        {JOB_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => onChange(role)}
            className={`px-base py-2 rounded-full border transition-all duration-200 text-b3 font-sans font-semibold ${
              value === role
                ? "border-teal-600 bg-teal-50 text-teal-900"
                : "border-border text-ink hover:border-teal-300 hover:bg-teal-50"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
