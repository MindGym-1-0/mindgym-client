import { getToken } from '@/lib/session/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export interface ApplicationItem {
  id: string;
  status: string;
  company: string;
  role: string;
}

export interface ApplicationsResponse {
  jobs: ApplicationItem[];
}

export interface FunnelCounts {
  applied: number;
  screening: number;
  final: number;
  offer: number;
}

export async function getApplications(): Promise<ApplicationItem[]> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Applications fetch failed (${res.status})`);
  }
  return res.json() as Promise<ApplicationItem[]>;
}

export function toFunnelCounts(applications: ApplicationItem[]): FunnelCounts {
  const counts: FunnelCounts = { applied: 0, screening: 0, final: 0, offer: 0 };
  for (const app of applications) {
    const s = app.status;
    if (s === 'applied') counts.applied++;
    else if (s === 'screen') counts.screening++;
    else if (s === 'hm' || s === 'deep' || s === 'final') counts.final++;
    else if (s === 'offer') counts.offer++;
  }
  return counts;
}
