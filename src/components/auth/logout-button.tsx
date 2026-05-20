"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./logout-button.module.css";

type LogoutResponse = {
  message?: string;
  error?: string;
};

function buildLogoutUrl() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  const safeBase = apiBase?.replace(/\/+$/, "");
  const fallbackPath = "/api/auth/logout";

  if (!safeBase) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[auth] NEXT_PUBLIC_API_URL not set, using relative logout path.");
    }
    return fallbackPath;
  }

  return `${safeBase}${fallbackPath}`;
}

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(buildLogoutUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      let payload: LogoutResponse | null = null;
      try {
        payload = (await response.json()) as LogoutResponse;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const fallback =
          response.status >= 500
            ? "Logout is temporarily unavailable. Please try again."
            : "Could not log you out. Please try again.";
        setError(payload?.error ?? fallback);
        if (process.env.NODE_ENV !== "production") {
          console.info("[auth] Logout failed", { status: response.status });
        }
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Network error while logging out. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.info("[auth] Logout network failure.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
      {error ? (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
