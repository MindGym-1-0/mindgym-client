// src/app/(main)/progress/insights/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getInsights, InsightsResponse } from "@/lib/insights/api";

const DOT_COLORS = [
  "bg-[#0C6B58]",
  "bg-orange-500",
  "bg-red-400",
];

const TOP_CARD_STYLES = [
  {
    border: "border-[#0C6B58]",
    bg: "bg-[#EAF8F4]",
    label: "text-[#0C6B58]",
    title: "text-[#0C6B58]",
    detail: "text-[#0C6B58]",
  },
  {
    border: "border-orange-300",
    bg: "bg-orange-50",
    label: "text-orange-500",
    title: "text-orange-600",
    detail: "text-orange-500",
  },
];

export default function InsightsPage() {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('@/lib/session/api').then(({ getToken }) => {
      getToken().then(tok => console.log('token:', tok)).catch(e => console.error('token error:', e));
    });
    
    getInsights()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const isEmpty =
    !loading &&
    !error &&
    data &&
    data.top_insights.length === 0 &&
    data.secondary_insights.length === 0 &&
    !data.hiring_funnel_gap;

  return (
    <div className="min-h-screen bg-[#F6F6F4] px-4 py-6 md:px-10 md:py-8">

      {/* Header */}
      <div>
        <p className="text-sm text-gray-500">Overview • Daily Dashboard</p>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold">Insights</h1>
        <p className="mt-2 text-sm text-gray-500">
          Remember, progress is rarely a straight line — every step counts on your journey.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          Failed to load insights. Please try again.
        </div>
      )}

      {/* Not enough data yet */}
      {isEmpty && (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm text-center">
          <p className="text-gray-500 text-sm">
            Complete at least 3 sessions to unlock your personalized insights.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-3xl bg-gray-100 p-6 animate-pulse h-36" />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-100 p-5 animate-pulse h-24" />
            ))}
          </div>
        </>
      )}

      {/* Top Insight Cards */}
      {!loading && data && data.top_insights.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {data.top_insights.map((item, i) => {
            const style = TOP_CARD_STYLES[i % TOP_CARD_STYLES.length];
            return (
              <div
                key={i}
                className={`rounded-3xl border ${style.border} ${style.bg} p-6`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${style.label}`}>
                  TOP INSIGHTS THIS WEEK
                </p>
                <h2 className={`mt-4 text-lg font-semibold ${style.title}`}>
                  {item.text}
                </h2>
                <p className={`mt-3 text-sm ${style.detail}`}>
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Secondary Mini Cards */}
      {!loading && data && data.secondary_insights.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {data.secondary_insights.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className={`mb-4 h-3 w-3 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hiring Funnel Gap */}
      {!loading && data?.hiring_funnel_gap && (
        <div className="mt-8 rounded-3xl border border-blue-300 bg-blue-50 p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
            {data.hiring_funnel_gap.title}
          </p>
          <h2 className="mt-4 text-xl font-semibold text-blue-700">
            {data.hiring_funnel_gap.body}
          </h2>
          <p className="mt-6 text-sm text-blue-500">
            Based on {data.hiring_funnel_gap.based_on}
          </p>
        </div>
      )}
    </div>
  );
}