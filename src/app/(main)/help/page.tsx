// src/app/(main)/help/page.tsx

import FAQCard from "../../../components/help/FAQCard";
import SupportBanner from "../../../components/help/SupportBanner";
import { faqItems } from "../../../lib/help-data";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-0">
      
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-5xl lg:text-[52px] font-semibold leading-tight md:leading-none text-[#1A1A1A]">
          Help & FAQ
        </h1>

        <p className="mt-3 md:mt-4 text-base md:text-lg text-[#7A7A7A] max-w-2xl">
          Everything you need to get the most from MindGym.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {faqItems.map((faq) => (
          <FAQCard
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      {/* Support Banner */}
      <div className="mt-6 md:mt-8">
        <SupportBanner />
      </div>
    </div>
  );
}