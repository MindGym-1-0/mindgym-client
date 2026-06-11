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

export interface RecommendedAction {
  title: string;
  body: string;
  timing: string;
}

export interface CompleteSessionResponse {
  session_id: string;
  anxiety_level_before: number;
  anxiety_level_after: number;
  anxiety_level_delta: number;
  session_number: number;
  recommended_actions: RecommendedAction[];
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

// ─── Daily Focus & Weekly Mission Additions ──────────────────────────────────

export interface DailyFocusPlan {
  id: string;
  date: string;
  action_1_text: string;
  action_1_type: string;
  action_1_completed: boolean;
  action_2_text: string | null;
  action_2_type: string | null;
  action_2_completed: boolean;
  current_streak?: number;
}

export interface WeeklyMissionPlan {
  id: string;
  week_start_date: string;
  action_1: string;
  action_1_completed: boolean;
  action_2: string;
  action_2_completed: boolean;
  action_3: string;
  action_3_completed: boolean;
  completion_count: number;
}

export async function generateDailyFocus(): Promise<DailyFocusPlan> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/daily_focus/generate`, { 
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to generate daily focus items (${res.status}): ${text}`);
  }
  return res.json() as Promise<DailyFocusPlan>;
}

export async function completeDailyFocus(actionId: "action_1" | "action_2"): Promise<{ current_streak: number }> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/daily_focus/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action_id: actionId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to mark focus task complete (${res.status}): ${text}`);
  }
  return res.json() as Promise<{ current_streak: number }>;
}

export async function generateWeeklyMission(): Promise<WeeklyMissionPlan> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/weekly_mission/generate`, { 
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to generate weekly mission criteria (${res.status}): ${text}`);
  }
  return res.json() as Promise<WeeklyMissionPlan>;
}

export async function completeWeeklyMission(
  missionItemId: "action_1" | "action_2" | "action_3"
): Promise<{ items_completed: number }> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/weekly_mission/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mission_item_id: missionItemId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to finalize weekly mission target (${res.status}): ${text}`);
  }
  return res.json() as Promise<{ items_completed: number }>;
}
