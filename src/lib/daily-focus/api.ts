import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

async function getToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;

  const { data: { session: refreshed } } = await supabase.auth.refreshSession();
  if (refreshed?.access_token) return refreshed.access_token;

  throw new Error('Not authenticated');
}

export interface DailyFocusPlan {
  id: string;
  user_id: string;
  date: string;
  action_1_text: string;
  action_1_type: string;
  action_1_completed: boolean;
  action_2_text: string | null;
  action_2_type: string | null;
  action_2_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyFocusCompleteResponse {
  success: boolean;
  current_streak: number;
  milestone: string | null;
}

export async function generateDailyFocus(): Promise<DailyFocusPlan> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/daily_focus/generate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to generate daily focus (${res.status}): ${text}`);
  }
  return res.json() as Promise<DailyFocusPlan>;
}

export async function completeDailyFocus(
  actionId: "action_1" | "action_2"
): Promise<DailyFocusCompleteResponse> {
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
    throw new Error(`Failed to complete daily focus action (${res.status}): ${text}`);
  }
  return res.json() as Promise<DailyFocusCompleteResponse>;
}
