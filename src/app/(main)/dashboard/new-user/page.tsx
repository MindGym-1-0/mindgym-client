"use client";

import Link from "next/link";
import {
  Flame,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F4] px-8 py-8">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        
        <div>
          <p className="text-sm text-[#686460]">
            Overview <span className="mx-2">›</span>
            Daily Dashboard
          </p>

          <h1 className="mt-5 text-[34px] font-semibold leading-[42px] text-[#171412]">
            Good morning, Claire. 👋
          </h1>

          <p className="mt-2 text-sm text-[#686460]">
            You completed your first session.
            Here&apos;s how your journey starts.
          </p>
        </div>

        {/* Mood */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#E7E5E4] bg-white px-4 py-3 shadow-sm">
          
          <span className="text-sm font-medium text-[#171412]">
            Mood today
          </span>

          <button className="rounded-full bg-[#DDF4EE] px-3 py-1 text-sm">
            😊
          </button>

          <button className="rounded-full bg-[#FFF3DD] px-3 py-1 text-sm">
            😐
          </button>

          <button className="rounded-full bg-[#FCE8E6] px-3 py-1 text-sm">
            😔
          </button>

          <button className="rounded-xl bg-[#126658] px-4 py-2 text-sm font-semibold text-white">
            Log
          </button>
        </div>
      </div>

      {/* Main Hero */}
      <div className="mt-8 rounded-[28px] bg-[#126658] p-8 text-white shadow-sm">
        
        <div className="flex items-start justify-between">
          
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7F3EC]">
              SESSION COMPLETE • TODAY
            </p>

            <h2 className="mt-4 max-w-xl text-[34px] font-semibold leading-[42px]">
              First steps —
              Breaking the Rejection Spiral
            </h2>

            <p className="mt-4 text-sm text-[#D7F3EC]">
              5 minutes • Mind reset
            </p>

            <div className="mt-6 flex gap-3">
              
              <Link
                href="/sessions/summary"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#126658]"
              >
                View session summary →
              </Link>

              <button className="rounded-xl border border-[#D7F3EC] px-5 py-3 text-sm font-semibold text-white">
                Add your first interview
              </button>
            </div>
          </div>

          {/* Anxiety Meter */}
          <div className="rounded-3xl bg-[#0D4E43] px-8 py-6 text-center">
            
            <p className="text-xs uppercase tracking-wide text-[#BFE7DD]">
              Anxiety Lift
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              
              <div className="text-5xl font-semibold">
                7
              </div>

              <div className="text-left text-sm text-[#BFE7DD]">
                → 4
                <br />
                -3 reduction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        
        {/* Left Column */}
        <div className="space-y-6 xl:col-span-2">
          
          {/* Quote */}
          <div className="rounded-3xl bg-[#0D2B26] p-6 text-white">
            
            <p className="text-sm uppercase tracking-wide text-[#BFE7DD]">
              Maya
            </p>

            <p className="mt-4 text-lg italic leading-8">
              “You were at a 7 and left at 4.
              That tells me — you&apos;re capable of
              calming yourself in difficult situations
              now.”
            </p>

            <button className="mt-6 rounded-xl bg-[#126658] px-5 py-3 text-sm font-semibold">
              Start next coach session →
            </button>
          </div>

          {/* Recommendation */}
          <div className="rounded-3xl border border-[#9ED8CA] bg-[#EAF8F4] p-6">
            
            <p className="text-xs uppercase tracking-wide text-[#126658]">
              NEXT PLAN RECOMMENDED
            </p>

            <h3 className="mt-4 text-xl font-semibold text-[#126658]">
              Rejection sensitivity
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#126658]">
              Confidence is building faster than
              expected. This is the primary focus
              area for you.
            </p>

            <p className="mt-4 text-sm font-medium text-[#126658]">
              Average session lift: +3.9
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-sm font-semibold text-[#171412]">
                  Add an upcoming interview
                </p>

                <p className="mt-2 text-sm text-[#686460]">
                  Keep all prep organized in one
                  place.
                </p>
              </div>

              <button className="rounded-xl bg-[#126658] px-4 py-2 text-sm font-semibold text-white">
                Add
              </button>
            </div>

            <div className="mt-6 space-y-4 border-t border-[#ECEAE8] pt-5">
              
              <div className="flex items-center gap-3">
                <Calendar size={16} />
                <span className="text-sm text-[#686460]">
                  Google tomorrow • 10:00 AM
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Flame size={16} />
                <span className="text-sm text-[#686460]">
                  Prepare your job history quickly
                </span>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp size={16} />
                <span className="text-sm text-[#686460]">
                  Maya focus picks up on search
                  progress
                </span>
              </div>
            </div>
          </div>

          {/* Interview Focus */}
          <div className="rounded-3xl border border-[#BFD2F3] bg-[#EEF4FF] p-6">
            
            <p className="text-xs uppercase tracking-wide text-[#4A6FA5]">
              INTERVIEW PLAN • NEXT FOCUS
            </p>

            <h3 className="mt-4 text-lg font-semibold text-[#4A6FA5]">
              Screening + first round conversion
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#4A6FA5]">
              A sequence of 2 sessions + 1 Mind
              Reset will improve patterns for more
              confidence.
            </p>

            <button className="mt-5 rounded-xl bg-[#4A6FA5] px-5 py-3 text-sm font-semibold text-white">
              Update your activity to keep this
              accurate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}