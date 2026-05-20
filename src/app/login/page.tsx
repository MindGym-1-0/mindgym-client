"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { buildAuthApiUrl } from "../../lib/auth/api";

type LoginResponse = {
  message?: string;
  error?: string;
};

function parseErrorMessage(status: number, payload: unknown) {
  const errorFromPayload =
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error?: unknown }).error === "string"
      ? (payload as { error: string }).error
      : undefined;

  if (status === 401) return "Invalid email or password.";
  if (status === 422) return errorFromPayload ?? "Please check your input and try again.";
  if (status >= 500) return "The server is unavailable right now. Please try again shortly.";
  return errorFromPayload ?? "Unable to sign in right now. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
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
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password })
      });

      let data: LoginResponse | null = null;
      try {
        data = (await response.json()) as LoginResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(parseErrorMessage(response.status, data));
        if (process.env.NODE_ENV !== "production") {
          console.info("[auth] Login failed", { status: response.status });
        }
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
      if (process.env.NODE_ENV !== "production") {
        console.info("[auth] Network failure while attempting login.");
      }
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
            <Link href="/signup" className={styles.footerAccent}>
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
