import { getToken } from '@/lib/session/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export interface TopInsightItem {
  text: string;
  detail: string;
  highlight: boolean;
}

export interface SecondaryInsightItem {
  text: string;
}

export interface HiringFunnelGap {
  title: string;
  body: string;
  based_on: string;
}

export interface InsightsResponse {
  top_insights: TopInsightItem[];
  secondary_insights: SecondaryInsightItem[];
  hiring_funnel_gap: HiringFunnelGap | null;
}

export async function getInsights(): Promise<InsightsResponse> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/insights`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insights fetch failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<InsightsResponse>;
}