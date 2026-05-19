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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">What kind of role are you aiming for?</h2>
        <p className="text-lg text-gray-600 mb-6">No need to be specific — a direction is enough.</p>
      </div>
      <input
        type="text"
        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all text-lg"
        placeholder="E.g., Product Designer, Software Engineer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-3 pt-4">
        {JOB_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => onChange(role)}
            className={`px-5 py-3 rounded-full border-2 font-semibold transition-all duration-200 ${
              value === role
                ? "border-teal-600 bg-teal-50 text-teal-900 shadow-md"
                : "border-gray-300 text-gray-800 hover:border-teal-400 hover:bg-gray-50"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
