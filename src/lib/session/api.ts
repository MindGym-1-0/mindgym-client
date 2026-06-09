import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export async function getToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;

  // Session not in memory (e.g. after full-page reload) - try refreshing via cookie
  const { data: { session: refreshed } } = await supabase.auth.refreshSession();
  if (refreshed?.access_token) return refreshed.access_token;

  throw new Error('Not authenticated');
}

export interface StartSessionRequest {
  preparation_for: string;
  current_feeling: string;
  desired_feeling: string[];
  time_available: string;
  anxiety_level_before: number;
  interview_id?: string;
  company?: string;
  role?: string;
  feeling_note?: string;
}

export interface SessionScript {
  phase1: string;
  phase2: string;
  phase3: string;
  phase4: string;
  phase5: string;
}

export interface StartSessionResponse {
  session_id: string;
  script: SessionScript;
  mode: string;
}

export interface CompleteSessionResponse {
  session_id: string;
  anxiety_level_before: number;
  anxiety_level_after: number;
  anxiety_level_delta: number;
  message: string;
}

export async function startSession(body: StartSessionRequest): Promise<StartSessionResponse> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/sessions/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Session start failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<StartSessionResponse>;
}

export async function completeSession(
  session_id: string,
  anxiety_level_after: number,
): Promise<CompleteSessionResponse> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/sessions/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ session_id, anxiety_level_after }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Session complete failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<CompleteSessionResponse>;
}

export interface SessionHistoryItem {
  id: string;
  preparation_for: string;
  anxiety_level_before: number;
  anxiety_level_after: number | null;
  anxiety_level_delta: number | null;
  completed_at: string | null;
  created_at: string;
}

export async function getSessionHistory(): Promise<SessionHistoryItem[]> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/sessions/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`History fetch failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<SessionHistoryItem[]>;
}

export interface SessionDetail {
  id: string;
  preparation_for: string;
  current_feeling: string | null;
  desired_feeling: string | null;
  time_available: string | null;
  company: string | null;
  role: string | null;
  feeling_note: string | null;
  anxiety_level_before: number;
  anxiety_level_after: number | null;
  anxiety_level_delta: number | null;
  script: SessionScript;
  completed_at: string | null;
  created_at: string;
}

export async function getSessionDetail(sessionId: string): Promise<SessionDetail> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Session fetch failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<SessionDetail>;
}
