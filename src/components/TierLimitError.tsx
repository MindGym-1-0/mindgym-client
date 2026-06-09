import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TierLimitErrorProps {
  type: "session" | "interview";
  currentTier: string;
  limit: number;
  used: number;
}

export function TierLimitError({ type, currentTier, limit, used }: TierLimitErrorProps) {
  const itemLabel = type === "session" ? "sessions" : "interviews";

  return (
    <div className="rounded-xl border border-[#FFA500] bg-[#FFF8E6] p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <AlertCircle size={20} className="text-[#FF8C00]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#8B5A00] mb-1">
            Tier limit reached
          </h3>
          <p className="text-sm text-[#8B5A00] mb-3">
            You've used {used} of {limit} {itemLabel} this month on your {currentTier} plan.
            Upgrade to use more {itemLabel}.
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FF8C00] hover:text-[#E67E00] transition"
          >
            View plans & upgrade
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
