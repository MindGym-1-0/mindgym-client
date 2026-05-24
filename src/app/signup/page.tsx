"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css";
import { buildAuthApiUrl } from "../../lib/auth/api";

type SignupResponse = {
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

  if (status === 409) return "An account with that email already exists.";
  if (status === 422) return errorFromPayload ?? "Please check your input and try again.";
  if (status >= 500) return "The server is unavailable right now. Please try again shortly.";
  return errorFromPayload ?? "Unable to create account right now. Please try again.";
}

function validatePasswordRequirements(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/\d/.test(password)) return "Password must include at least one number.";
  return null;
}

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    setError(null);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const pwRequirement = validatePasswordRequirements(password);
    if (pwRequirement) {
      setError(pwRequirement);
      return;
    }

    let signupUrl: string;
    try {
      signupUrl = buildAuthApiUrl("/api/auth/signup");
    } catch {
      setError("Authentication is not configured. Please set NEXT_PUBLIC_API_URL.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(signupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password })
      });

      let data: SignupResponse | null = null;
      try {
        data = (await response.json()) as SignupResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(parseErrorMessage(response.status, data));
        if (process.env.NODE_ENV !== "production") {
          console.info("[auth] Signup failed", { status: response.status });
        }
        return;
      }

      router.replace("/onboarding");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
      if (process.env.NODE_ENV !== "production") {
        console.info("[auth] Network failure while attempting signup.");
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
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Start your mental journey</p>

          <button type="button" disabled className={styles.socialButton}>
            Continue with Google (Coming soon)
          </button>

          <div className={styles.dividerRow}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or sign up with email</span>
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
              onChange={(ev) => setEmail(ev.target.value)}
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
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />

            <label htmlFor="confirm" className={styles.label}>
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
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
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" className={styles.footerAccent}>
              Sign in
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
