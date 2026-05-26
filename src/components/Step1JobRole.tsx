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

export function Step1JobRole({
  value,
  onChange,
}: Step1JobRoleProps) {
  return (
    <div className="space-y-8 text-center">
      
      <div>
        <h2 className="text-[40px] leading-[48px] font-semibold text-[#171412]">
          What kind of role are you aiming for?
        </h2>

        <p className="mt-4 text-[16px] text-[#686460]">
          No need to be specific — a direction is enough.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="e.g. Product Designer, Software Engineer..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-[#E7E5E4] bg-white px-5 py-4 text-[15px] outline-none transition-all focus:border-[#126658]"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {JOB_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => onChange(role)}
            className={`rounded-full border px-5 py-3 text-[14px] font-medium transition-all ${
              value === role
                ? "border-[#126658] bg-[#DDF2EE] text-[#126658]"
                : "border-[#E7E5E4] bg-white text-[#171412] hover:border-[#126658]"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}