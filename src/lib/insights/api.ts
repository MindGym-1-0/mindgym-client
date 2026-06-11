import { getToken } from '@/lib/session/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export interface UserProfile {
  mindset_gap: string | null;
  mindset_gap_detail: string | null;
  hunting_gap: string | null;
  hunting_gap_detail: string | null;
  applications_sent_min: number | null;
  applications_sent_max: number | null;
  recruiter_contacts: number | null;
  first_round_interviews: number | null;
  final_round_interviews: number | null;
  offers: number | null;
}

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

export async function getUserProfile(): Promise<UserProfile> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`User profile fetch failed (${res.status})`);
  }
  return res.json() as Promise<UserProfile>;
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