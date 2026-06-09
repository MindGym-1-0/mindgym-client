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

export type TierName = 'free' | 'pro' | 'premium';

export interface Tier {
  name: TierName;
  price: number;
  currency: string;
  billing_period: 'monthly' | 'annual';
  session_quota: number;
  interview_quota: number;
  features: string[];
}

export interface CurrentPlan {
  tier: TierName;
  sessions_used: number;
  sessions_limit: number;
  interviews_used: number;
  interviews_limit: number;
  renewal_date: string; // ISO 8601 date string
  is_trial: boolean;
}

export class SubscriptionError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'SubscriptionError';
    this.status = status;
    this.code = code;
  }
}

export async function getTiers(): Promise<Tier[]> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/subscriptions/tiers`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new SubscriptionError(res.status, `Failed to fetch tiers (${res.status}): ${text}`);
  }

  return res.json() as Promise<Tier[]>;
}

export async function getCurrentPlan(): Promise<CurrentPlan> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/subscriptions/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new SubscriptionError(res.status, `Failed to fetch current plan (${res.status}): ${text}`);
  }

  return res.json() as Promise<CurrentPlan>;
}

/**
 * Check if a 403 error is due to subscription tier limits
 */
export function isTierLimitError(error: unknown): boolean {
  if (error instanceof SubscriptionError && error.status === 403) {
    return true;
  }
  if (error instanceof Error && error.message.includes('403')) {
    return true;
  }
  return false;
}
