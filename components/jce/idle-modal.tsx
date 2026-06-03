"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// Idle-timeout modal (shell.jsx:191-205 · X1). 30-minute inactivity → a 60-second
// warning; no response signs out. NFR-SEC-03. The card is split out so the
// Foundations gallery can render it statically.

const IDLE_MS = 30 * 60 * 1000;
const WARN_SECONDS = 60;
const ACTIVITY = ["mousemove", "keydown", "scroll", "click", "touchstart"];

export function IdleWarningCard({
  seconds,
  onStay,
  onSignOut,
}: {
  seconds: number;
  onStay: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="glass-modal w-full max-w-sm rounded-[var(--r-glass)] p-6 text-center">
      <div className="mx-auto grid size-11 place-items-center rounded-full bg-[var(--st-pending-bg)] text-[var(--st-pending-ink)]">
        <LockIcon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-3 text-ui-18 font-bold text-jce-ink">Still there?</h3>
      <p className="mt-2 text-ui-13 text-jce-ink-2">
        For security your session will end in{" "}
        <strong className="tabular-nums text-jce-ink">{seconds} seconds</strong>{" "}
        of continued inactivity. (30-minute idle timeout — NFR-SEC-03.)
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={onSignOut}>
          Sign out
        </Button>
        <Button size="sm" onClick={onStay}>
          Stay signed in
        </Button>
      </div>
    </div>
  );
}

export function IdleModal() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(WARN_SECONDS);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);
  const router = useRouter();

  const armIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setCount(WARN_SECONDS);
      setOpen(true);
    }, IDLE_MS);
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    armIdle();
    const onActivity = () => {
      if (!openRef.current) armIdle();
    };
    ACTIVITY.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    return () => {
      ACTIVITY.forEach((e) => window.removeEventListener(e, onActivity));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [armIdle]);

  // Countdown while the warning is open.
  useEffect(() => {
    if (!open) return;
    if (count <= 0) {
      router.push("/login");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [open, count, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 supports-backdrop-filter:backdrop-blur-xs">
      <IdleWarningCard
        seconds={count}
        onStay={() => {
          setOpen(false);
          armIdle();
        }}
        onSignOut={() => router.push("/login")}
      />
    </div>
  );
}
