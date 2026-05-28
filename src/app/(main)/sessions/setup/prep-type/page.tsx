// src/app/(main)/sessions/setup/prep-type/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

const types = [
  "Interview tomorrow",
  "Recruiter call",
  "Rejection recovery",
  "Networking",
  "Salary negotiation",
  "Restarting my search",
  "General reset",
];

export default function PrepTypePage() {
  const [selectedType, setSelectedType] =
    useState("");

  const continueHref =
    selectedType === "Interview tomorrow"
      ? "/sessions/setup/interview-details"
      : "/sessions/setup/feelings";

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      
      <p className="mb-8 text-[#0C6B58]">
        Session setup • Step 2 of 4
      </p>

      <div className="text-center">
        
        <h1 className="text-4xl font-semibold text-[#171412]">
          What are you preparing for?
        </h1>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {types.map((type) => (
            <button
              key={type}
              onClick={() =>
                setSelectedType(type)
              }
              className={`rounded-full border px-5 py-3 transition-all ${
                selectedType === type
                  ? "border-[#0C6B58] bg-[#DDF4EE] text-[#0C6B58]"
                  : "bg-white hover:bg-[#DDF4EE]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          
          <Link
            href="/sessions/setup/emotions"
            className="rounded-xl border border-[#D8D5D1] bg-white px-5 py-3"
          >
            ← Back
          </Link>

          <Link
            href={continueHref}
            className={`rounded-xl px-5 py-3 text-white transition-all ${
              selectedType
                ? "bg-[#0C6B58] hover:bg-[#084C3F]"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Continue →
          </Link>
        </div>
      </div>
    </div>
  );
}