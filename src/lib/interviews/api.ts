import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

async function getToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;

  const { data: { session: refreshed } } = await supabase.auth.refreshSession();
  if (refreshed?.access_token) return refreshed.access_token;

  throw new Error('Not authenticated');
}

export interface InterviewItem {
  id: string;
  user_id: string;
  company: string;
  role: string;
  interview_date: string;
  event_type: string;
  job_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface InterviewListResponse {
  upcoming: InterviewItem[];
  past: InterviewItem[];
}

export async function getInterviews(): Promise<InterviewListResponse> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/interviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Interviews fetch failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<InterviewListResponse>;
}
