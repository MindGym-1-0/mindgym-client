"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import { buildAuthApiUrl, establishSupabaseSession } from "../../lib/auth/api";

type LoginResponse = {
  authenticated?: boolean;
  detail?: string;
  session?: {
    access_token: string;
    refresh_token: string;
  };
};

function messageFromPayload(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;
  const detail = (payload as { detail?: unknown }).detail;
  return typeof detail === "string" ? detail : undefined;
}

function parseErrorMessage(status: number, payload: unknown) {
  const detail = messageFromPayload(payload);

  if (status === 401) return detail ?? "Invalid email or password.";
  if (status === 403) return detail ?? "Please confirm your email before signing in.";
  if (status === 422) return detail ?? "Please check your input and try again.";
  if (status >= 500) {
    return detail ?? "The server is unavailable right now. Please try again shortly.";
  }
  return detail ?? "Unable to sign in right now. Please try again.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    let loginUrl: string;
    try {
      loginUrl = buildAuthApiUrl("/api/auth/login");
    } catch {
      setError("Authentication is not configured. Please set NEXT_PUBLIC_API_URL.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data: LoginResponse | null = null;
      try {
        data = (await response.json()) as LoginResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(parseErrorMessage(response.status, data));
        return;
      }

      if (!data?.authenticated) {
        setError("Sign-in did not complete. Please try again.");
        return;
      }

      if (data.session?.access_token && data.session?.refresh_token) {
        await establishSupabaseSession(data.session);
      }

      window.location.assign("/dashboard");
      return;
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
        return;
      }
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.leftPanel}>
        <div className={styles.formWrap}>
          <p className={styles.brand}>MindGym</p>
          <h1 className={styles.title}>Welcome back.</h1>
          <p className={styles.subtitle}>Start your mental journey</p>

          <button type="button" disabled className={styles.socialButton}>
            Continue with Google (Coming soon)
          </button>

          <div className={styles.dividerRow}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or sign in with email</span>
            <span className={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />

            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />

            {error ? (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className={styles.footerAccent}>
              Create one
            </Link>
          </p>
        </div>
      </section>

      <aside className={styles.rightPanel}>
        <div className={styles.quoteWrap}>
          <div className={styles.logoBadge} aria-hidden>
            Leaf
          </div>
          <p className={styles.quote}>&quot;You&apos;ve already started the hardest part - showing up.&quot;</p>
          <p className={styles.quoteSub}>MindGym · Built for job seekers</p>
        </div>
      </aside>
    </main>
  );
}
