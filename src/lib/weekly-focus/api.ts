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

export interface WeeklyMissionPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  action_1: string;
  action_1_completed: boolean;
  action_2: string;
  action_2_completed: boolean;
  action_3: string;
  action_3_completed: boolean;
  completion_count: number;
  generated_at: string;
  updated_at: string;
}

export interface WeeklyMissionCompleteResponse {
  success: boolean;
  items_completed: number;
  total_items: number;
}

export async function generateWeeklyMission(): Promise<WeeklyMissionPlan> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/weekly_mission/generate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to generate weekly mission (${res.status}): ${text}`);
  }
  return res.json() as Promise<WeeklyMissionPlan>;
}

export async function completeWeeklyMission(
  missionItemId: "action_1" | "action_2" | "action_3"
): Promise<WeeklyMissionCompleteResponse> {
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
    throw new Error(`Failed to complete weekly mission item (${res.status}): ${text}`);
  }
  return res.json() as Promise<WeeklyMissionCompleteResponse>;
}
