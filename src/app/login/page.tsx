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

          <button
            type="button"
            className={styles.socialButton}
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              window.location.href = `${apiUrl}/api/auth/google`;
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
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
