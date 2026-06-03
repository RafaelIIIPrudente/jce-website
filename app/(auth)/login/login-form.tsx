"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// X2 · Login (screens-core.jsx:12-85). MOCK auth: any non-empty credentials sign
// in; username "fail" forces the invalid-credential path; 3 failed attempts lock
// the form with a live 30s cooldown. No real auth — routes to /dashboard.

const MAX_TRIES = 3;
const COOLDOWN_SECONDS = 30;

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);

  // Lockout cooldown timer — all state changes happen inside the async tick
  // (never synchronously in the effect body).
  useEffect(() => {
    if (!locked) return;
    const t = setTimeout(() => {
      if (cooldown <= 1) {
        setLocked(false);
        setTries(0);
        setError("");
        setCooldown(0);
      } else {
        setCooldown(cooldown - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [locked, cooldown]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setBusy(true);
    // Simulated round-trip.
    setTimeout(() => {
      setBusy(false);
      const u = username.trim();
      if (u && password.trim() && u.toLowerCase() !== "fail") {
        router.push("/dashboard");
        return;
      }
      const next = tries + 1;
      setTries(next);
      if (next >= MAX_TRIES) {
        setLocked(true);
        setCooldown(COOLDOWN_SECONDS);
        setError("");
      } else {
        setError("The username or password you entered is incorrect.");
      }
    }, 600);
  };

  return (
    <div className="jce-backdrop relative grid min-h-[100dvh] place-items-center p-4">
      <span className="jce-glow-3" aria-hidden />
      <form
        onSubmit={submit}
        className="glass w-full max-w-md rounded-[var(--r-glass)] p-6"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/jce-logo.jpg"
            width={44}
            height={44}
            alt="JCE"
            className="rounded-lg shadow-[var(--solid-shadow)]"
          />
          <div>
            <div className="text-ui-18 font-bold text-jce-ink">JCE System</div>
            <div className="text-ui-12 text-jce-ink-2">
              JC Electrofields Power System, Inc.
            </div>
          </div>
        </div>

        <div className="solid mt-5 p-5">
          {locked ? (
            <div className="flex items-start gap-3">
              <LockIcon
                className="mt-0.5 size-5 shrink-0 text-[var(--st-danger)]"
                aria-hidden
              />
              <div>
                <div className="text-ui-14 font-semibold text-jce-ink">
                  Account temporarily locked
                </div>
                <div className="text-ui-13 text-jce-ink-2">
                  Too many attempts. Try again in{" "}
                  <strong className="tabular-nums text-jce-ink">
                    {cooldown}s
                  </strong>
                  .
                </div>
              </div>
            </div>
          ) : (
            <>
              <label
                htmlFor="login-username"
                className="block text-ui-12 font-semibold text-jce-ink-2"
              >
                Username or Email
              </label>
              <input
                id="login-username"
                className="field mt-1.5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="firstname.lastname"
                autoComplete="username"
                autoFocus
              />
              <label
                htmlFor="login-password"
                className="mt-3.5 block text-ui-12 font-semibold text-jce-ink-2"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="field mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {error ? (
                <div className="mt-3 flex items-center gap-1.5 text-ui-12 text-[var(--st-danger)]">
                  <span
                    className="size-1.5 rounded-full bg-[var(--st-danger)]"
                    aria-hidden
                  />
                  {error}
                </div>
              ) : null}
              <Button type="submit" className="mt-4 w-full" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-3 block text-center text-ui-12 text-jce-green-700 hover:underline"
              >
                Forgot password?
              </a>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-ui-12 text-jce-ink-2">
          Authorized access only · activity is audited (NFR-SEC). MFA for
          Owner/Admin recommended — OPEN-Q #15.
          <br />
          <span>
            Demo: any non-empty credentials sign in; username “fail” forces the
            error path.
          </span>
        </p>
      </form>
    </div>
  );
}
