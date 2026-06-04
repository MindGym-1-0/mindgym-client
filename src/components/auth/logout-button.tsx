"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./logout-button.module.css";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      // Best-effort backend call — don't block logout if it fails
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});

      await getSupabaseBrowserClient().auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Could not log you out. Please try again.");
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
