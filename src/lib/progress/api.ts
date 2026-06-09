import { getToken } from '@/lib/session/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export interface ProgressResponse {
  sessions_done: number;
  day_streak: number;
  avg_lift_per_session: number;
  key_insight: string;
}

export async function getProgress(period: 'week' | 'month' | 'all' = 'week'): Promise<ProgressResponse> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/progress?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Progress fetch failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<ProgressResponse>;
}