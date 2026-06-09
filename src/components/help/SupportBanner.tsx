import { MessageCircleQuestion } from "lucide-react";

export default function SupportBanner() {
  return (
    <div className="mt-8 rounded-3xl border border-[#E7E7E4] bg-white p-6 md:px-8 md:py-7 shadow-sm">
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-start gap-5">
          
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E7F5F0]">
            <MessageCircleQuestion
              size={26}
              className="text-[#0C6B58]"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight text-[#0C6B58]">
              Still need help?
            </h2>

            <p className="mt-3 max-w-[700px] text-sm md:text-[15px] leading-7 text-[#5E5E5E]">
              We&apos;re a small team and we actually read every
              message. Response time is usually under 24 hours
              on weekdays.
            </p>
          </div>
        </div>

      {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <a
            href="mailto:clairehzhu@gmail.com"
            className="w-full sm:w-auto rounded-xl bg-[#0C6B58] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 text-center"
          >
            Email support
          </a>
        </div>
      </div>
    </div>
  );
}
