const SETUP_KEY = 'mindgym_setup';
const ACTIVE_KEY = 'mindgym_active';

export interface SetupDraft {
  current_feeling?:  'overwhelmed' | 'discouraged' | 'exhausted' | 'unsure' | 'anxious but hopeful';
  feeling_note?: string;
  anxiety_level_before?: number;
  preparation_for?: string;
  company?: string;
  role?: string;
  desired_feeling?: ('calm' | 'grounded' | 'confident' | 'focused' | 'clear_minded' | 'composed')[];
  time_available?: '5 min' | '10 min' | '15 min';
}

export interface ActiveSession {
  session_id: string;
  script: { phase1: string; phase2: string; phase3: string; phase4: string; phase5: string };
  anxiety_level_before: number;
}

export function readSetup(): SetupDraft {
  try {
    return JSON.parse(sessionStorage.getItem(SETUP_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function writeSetup(patch: Partial<SetupDraft>): void {
  const current = readSetup();
  sessionStorage.setItem(SETUP_KEY, JSON.stringify({ ...current, ...patch }));
}

export function clearSetup(): void {
  sessionStorage.removeItem(SETUP_KEY);
}

export function readActive(): ActiveSession | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_KEY);
    return raw ? (JSON.parse(raw) as ActiveSession) : null;
  } catch {
    return null;
  }
}

export function writeActive(session: ActiveSession): void {
  sessionStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
}

export function clearActive(): void {
  sessionStorage.removeItem(ACTIVE_KEY);
}
