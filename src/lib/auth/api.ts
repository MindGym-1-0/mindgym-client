import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const API_BASE_ENV = process.env.NEXT_PUBLIC_API_URL?.trim();

function normalizeApiBaseUrl() {
  if (!API_BASE_ENV) {
    throw new Error("Missing NEXT_PUBLIC_API_URL. Set it in your frontend environment.");
  }

  return API_BASE_ENV.replace(/\/+$/, "");
}

export function buildAuthApiUrl(path: `/api/auth/${string}`) {
  return `${normalizeApiBaseUrl()}${path}`;
}

export type AuthSessionPayload = {
  access_token: string;
  refresh_token: string;
};

export async function establishSupabaseSession(session: AuthSessionPayload) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  if (error) {
    throw new Error(error.message);
  }
}
