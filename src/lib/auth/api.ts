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
