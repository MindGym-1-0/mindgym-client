import { getToken } from '@/lib/session/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

/**
 * Fetches audio for one phase of a session from the backend.
 * Buffers the full response into a Blob and returns an object URL for
 * gapless, stutter-free playback. Returns null on any failure so the
 * caller can fall back to the typewriter text animation.
 */
export async function fetchPhaseAudio(
  sessionId: string,
  phase: number,
): Promise<string | null> {
  try {
    const token = await getToken();
    const res = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/audio/${phase}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!res.ok) {
      console.warn(`Audio fetch failed for phase ${phase}: ${res.status}`);
      return null;
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn(`Audio fetch error for phase ${phase}:`, err);
    return null;
  }
}

/**
 * Revoke an object URL to release the memory held by the audio Blob.
 * Call this when a phase ends and its audio is no longer needed.
 */
export function revokePhaseAudio(objectUrl: string): void {
  URL.revokeObjectURL(objectUrl);
}
