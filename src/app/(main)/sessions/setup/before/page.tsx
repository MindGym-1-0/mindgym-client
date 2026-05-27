"use client";

import Link from "next/link";
import { useState } from "react";

export default function SessionEmotionsPage() {
  const [selectedValue, setSelectedValue] =
    useState(4);

  return (
    <div className="min-h-screen bg-[#F6F6F4]">
      
      {/* Main */}
      <div className="mx-auto max-w-5xl px-8 py-10">

        {/* Title */}
        <div className="mt-10 flex flex-col items-center">
          
          <h1 className="max-w-xl text-center text-[34px] font-semibold leading-[42px] text-[#171412]">
            Before your session — how anxious do you feel right now?
          </h1>

          {/* Maya Bubble */}
          <div className="mt-8 flex items-start gap-3">
            
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#126658] text-sm font-semibold text-white">
              M
            </div>

            {/* Bubble */}
            <div className="max-w-md rounded-xl border border-[#E7E5E4] bg-white px-4 py-3 text-sm text-[#171412] shadow-sm">
              “Before we begin — give me a number.
              How anxious are you feeling right now,
              honestly?”
            </div>
          </div>

          {/* Score */}
          <div className="mt-10 text-center">
            
            <div className="text-[72px] font-semibold leading-none text-[#171412]">
              {selectedValue}
            </div>

            <p className="mt-2 text-sm text-[#686460]">
              Some tension — still present
            </p>
          </div>

          {/* Slider */}
          <div className="mt-10 w-full max-w-xl">
            
            <input
              type="range"
              min="1"
              max="10"
              value={selectedValue}
              onChange={(e) =>
                setSelectedValue(
                  Number(e.target.value)
                )
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D8D5D1]"
            />

            {/* Labels */}
            <div className="mt-3 flex justify-between text-xs text-[#9A9691]">
              <span>1 • Calm</span>
              <span>5 • Moderate</span>
              <span>10 • Very high</span>
            </div>
          </div>

          {/* Button */}
          <Link
            href="/sessions/setup/summary"
            className="mt-10 rounded-xl bg-[#126658] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0D4E43]"
          >
            Begin session →
          </Link>

          {/* Footer Text */}
          <p className="mt-5 text-xs text-[#A6A29F]">
            You&apos;ll track again at the session&apos;s
            end for change.
          </p>
        </div>
      </div>
    </div>
  );
}