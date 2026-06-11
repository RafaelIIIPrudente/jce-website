"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import {
  HOME_CAPABILITY_CORE,
  HOME_CAPABILITY_NODES,
  type CapabilityNode,
} from "@/lib/content/website";

// CapabilityOrbit — JCE's "energy core": the Ω brand mark glows at the centre
// with the real EPC capabilities orbiting it. Clicking/keyboarding a node opens
// a card with a blurb, related capabilities, a photo, and a link to the service.
//
// Two modes from ONE source of truth (no duplicated content):
//   • Orbit (md+, motion-OK, after mount) — slow rAF rotation, paused when a
//     node is open / hovered / focused / the tab is hidden / the section is
//     off-screen. The expanded card is a dark token surface centred over the core.
//   • Static grid (SSR / no-JS / mobile / prefers-reduced-motion) — a calm
//     readable grid: every title + blurb visible, each card expandable to its
//     photo + related links. No rotation, no pulse.
// SSR renders the static grid, so all content is reachable without JS; the orbit
// is a progressive enhancement that swaps in at hydration on capable screens.

const NODES = HOME_CAPABILITY_NODES;

function byId(id: string): CapabilityNode | undefined {
  return NODES.find((n) => n.id === id);
}

// Shared shell for the centred card — reused by the pinned modal and the
// non-modal hover/focus preview so they stay visually identical.
const CARD_SHELL =
  "absolute top-1/2 left-1/2 w-96 max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-(--r-glass) border border-jce-cyan/30 bg-jce-dark-2 shadow-(--current-glow)";

// :focus-visible test, guarded so an engine without support can't throw inside
// the onFocus handler (keyboard focus opens a preview; pointer focus does not).
function isFocusVisible(el: Element): boolean {
  try {
    return el.matches(":focus-visible");
  } catch {
    return false;
  }
}

export function CapabilityOrbit() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsWide(mq.matches);
    mq.addEventListener("change", sync);
    // Defer the initial state out of the synchronous effect body (enables the
    // orbit only after mount, so SSR renders the static grid → no hydration
    // mismatch, and the priority hero stays the LCP).
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      setIsWide(mq.matches);
    });
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);

  const toggle = useCallback(
    (id: string) => setActiveId((cur) => (cur === id ? null : id)),
    [],
  );
  const select = useCallback((id: string) => setActiveId(id), []);
  const close = useCallback(() => setActiveId(null), []);

  const orbitActive = mounted && isWide && !reduce;

  return orbitActive ? (
    <OrbitView
      activeId={activeId}
      onToggle={toggle}
      onSelect={select}
      onClose={close}
    />
  ) : (
    <StaticView activeId={activeId} onToggle={toggle} onSelect={select} />
  );
}

// ── Orbit (md+, motion) ───────────────────────────────────────────────────────
function OrbitView({
  activeId,
  onToggle,
  onSelect,
  onClose,
}: {
  activeId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const reactId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const angleRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [onScreen, setOnScreen] = useState(true);
  // The hovered/focused node — drives the core caption AND pauses rotation so
  // the node is stationary to read/activate.
  const [hintId, setHintId] = useState<string | null>(null);
  // The node shown as a NON-modal preview on hover / keyboard focus (distinct
  // from the pinned modal `activeId`). Persists while the pointer is on the node
  // OR the card (close timer below) per WCAG 2.2 SC 1.4.13 (Hoverable).
  const [previewId, setPreviewId] = useState<string | null>(null);
  // Hover-open is gated to fine+hover pointers so touch/hybrid devices never get
  // a stuck-open preview (there, tap = click = pin). Read live in handlers.
  const hoverCapableRef = useRef(false);
  // Close-intent grace timer — lets the pointer cross from node to card without
  // the preview flickering shut.
  const closeTimerRef = useRef<number | null>(null);

  const paused =
    activeId !== null || previewId !== null || hintId !== null || !onScreen;

  // Detect pointer capability once (client only).
  useEffect(() => {
    hoverCapableRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);
  const openPreview = useCallback(
    (id: string) => {
      cancelClose();
      setPreviewId(id);
    },
    [cancelClose],
  );
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setPreviewId(null), 120);
  }, [cancelClose]);

  // Clear any pending close timer on unmount.
  useEffect(() => () => cancelClose(), [cancelClose]);

  // Pause when the section scrolls off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Slow rotation via requestAnimationFrame (NOT setInterval). Paused on the
  // conditions above + when the tab is hidden. Transforms are mutated directly
  // (no per-frame setState) so the loop never costs an INP-relevant render.
  useEffect(() => {
    if (paused) return;
    const SPEED = 360 / 96000; // deg per ms → one slow turn ≈ 96s
    const step = (t: number) => {
      if (lastRef.current === null) lastRef.current = t;
      const dt = t - lastRef.current;
      lastRef.current = t;
      if (!document.hidden) {
        angleRef.current = (angleRef.current + dt * SPEED) % 360;
        if (ringRef.current) {
          ringRef.current.style.transform = `rotate(${angleRef.current}deg)`;
        }
        for (const id in contentRefs.current) {
          const el = contentRefs.current[id];
          if (el) el.style.transform = `rotate(${-angleRef.current}deg)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [paused]);

  // Move focus to the opened card; Escape closes and returns focus to the node.
  useEffect(() => {
    if (activeId) headingRef.current?.focus();
  }, [activeId]);

  const closeAndRefocus = useCallback(() => {
    const id = activeId;
    onClose();
    if (id) nodeRefs.current[id]?.focus();
  }, [activeId, onClose]);

  // Escape: pinned → close + return focus to the node; preview → dismiss it in
  // place (no pointer/focus move) per WCAG 2.2 SC 1.4.13 (Dismissable).
  useEffect(() => {
    if (!activeId && !previewId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (activeId) closeAndRefocus();
      else setPreviewId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeId, previewId, closeAndRefocus]);

  const pinned = activeId ? byId(activeId) : undefined;
  const previewing = !pinned && previewId ? byId(previewId) : undefined;
  const shown = pinned ?? previewing;
  const panelId = `orbit-panel-${reactId}`;
  const headingId = `${panelId}-title`;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-136"
    >
      {/* Decorative orbit path. */}
      <div
        aria-hidden
        className="absolute inset-[10%] rounded-full border border-jce-dark-line"
      />

      {/* Glowing Ω energy core. */}
      <div className="absolute top-1/2 left-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-32">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-jce-cyan/15 blur-2xl"
        />
        <span
          aria-hidden
          className="absolute inset-2 rounded-full border border-jce-cyan/30"
        />
        <OmegaMark
          pulse
          strokeWidth={5}
          className="size-16 text-jce-green-500 sm:size-20"
        />
      </div>

      {/* Core caption — the brand promise by default, the hovered/focused
          capability while interacting. Decorative; each node's accessible name
          carries the title for assistive tech. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 mt-16 w-48 max-w-[60%] -translate-x-1/2 text-center sm:mt-20"
      >
        <span className="text-ui-13 font-semibold text-balance text-jce-dark-ink">
          {hintId
            ? (byId(hintId)?.title ?? HOME_CAPABILITY_CORE.coreLabel)
            : HOME_CAPABILITY_CORE.coreLabel}
        </span>
      </div>

      {/* Rotating ring of capability nodes. */}
      <div ref={ringRef} className="absolute inset-0">
        {NODES.map((node, i) => {
          const theta = (i / NODES.length) * 2 * Math.PI - Math.PI / 2;
          const r = 40; // % of half-size — clearance for the larger nodes
          const x = 50 + r * Math.cos(theta);
          const y = 50 + r * Math.sin(theta);
          const isActive = node.id === activeId;
          const Icon = node.icon;
          return (
            <button
              key={node.id}
              type="button"
              ref={(el) => {
                nodeRefs.current[node.id] = el;
              }}
              onClick={() => onToggle(node.id)}
              onMouseEnter={() => {
                setHintId(node.id);
                if (hoverCapableRef.current) openPreview(node.id);
              }}
              onMouseLeave={() => {
                setHintId((cur) => (cur === node.id ? null : cur));
                if (hoverCapableRef.current) scheduleClose();
              }}
              onFocus={(e) => {
                setHintId(node.id);
                // Keyboard focus opens the preview (parity with hover); a
                // pointer-driven focus on touch is not :focus-visible → no
                // stuck preview (tap there just pins via onClick).
                if (
                  hoverCapableRef.current ||
                  isFocusVisible(e.currentTarget)
                ) {
                  openPreview(node.id);
                }
              }}
              onBlur={() => {
                setHintId((cur) => (cur === node.id ? null : cur));
                scheduleClose();
              }}
              aria-expanded={isActive}
              aria-controls={panelId}
              aria-label={`${node.title} — ${isActive ? "hide" : "show"} details`}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={cn(
                "focus-ring-cyan absolute grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-sm transition-colors sm:size-20",
                isActive
                  ? "border-jce-cyan bg-jce-dark-2 shadow-(--current-glow)"
                  : "border-jce-dark-line bg-jce-dark-2/70 hover:border-jce-cyan/60",
              )}
            >
              <span
                ref={(el) => {
                  contentRefs.current[node.id] = el;
                }}
                className="block"
              >
                <Icon
                  className={cn(
                    "size-7 sm:size-8",
                    isActive ? "text-jce-cyan-bright" : "text-jce-dark-ink",
                  )}
                  aria-hidden
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* Card — PINNED (click/Enter/Space → modal) or PREVIEW (hover / keyboard
          focus → non-modal popover: no focus steal, no backdrop, no scroll-lock).
          Preview keeps the card open while hovered (Hoverable) and Escape-/
          leave-dismissable (SC 1.4.13). */}
      {shown ? (
        pinned ? (
          <>
            <button
              type="button"
              aria-label="Close capability details"
              onClick={closeAndRefocus}
              className="focus-ring-cyan absolute inset-0 cursor-default"
            />
            <div
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              className={CARD_SHELL}
            >
              <OrbitCardBody
                node={pinned}
                headingRef={headingRef}
                headingId={headingId}
                onSelect={onSelect}
                onClose={closeAndRefocus}
              />
            </div>
          </>
        ) : (
          <div
            id={panelId}
            role="group"
            aria-label={shown.title}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onFocus={cancelClose}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                scheduleClose();
              }
            }}
            className={CARD_SHELL}
          >
            <OrbitCardBody
              node={shown}
              headingRef={headingRef}
              headingId={headingId}
              onSelect={onSelect}
              onClose={() => setPreviewId(null)}
            />
          </div>
        )
      ) : null}
    </div>
  );
}

function OrbitCardBody({
  node,
  headingRef,
  headingId,
  onSelect,
  onClose,
}: {
  node: CapabilityNode;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  headingId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <div className="relative aspect-16/10 w-full">
        <Image
          src={node.img}
          alt={node.imgAlt}
          fill
          sizes="(min-width: 768px) 24rem, 80vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-jce-dark-2 via-jce-dark-2/30 to-transparent"
        />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="focus-ring-cyan absolute top-2 right-2 grid size-11 place-items-center rounded-full border border-jce-dark-line bg-jce-dark/60 text-jce-dark-ink backdrop-blur-sm transition-colors hover:bg-jce-dark/80"
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      </div>
      <div className="p-4">
        <h3
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="focus-ring-cyan rounded-(--r-input) text-ui-16 font-semibold text-balance text-jce-dark-ink"
        >
          {node.title}
        </h3>
        <p className="mt-1.5 text-ui-13 text-pretty text-jce-dark-ink-2">
          {node.blurb}
        </p>
        <RelatedLinks related={node.related} onSelect={onSelect} />
        <ExploreLink href={node.href} />
      </div>
    </div>
  );
}

// ── Static grid (SSR / no-JS / mobile / reduced-motion) ───────────────────────
function StaticView({
  activeId,
  onToggle,
  onSelect,
}: {
  activeId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const reactId = useId().replace(/:/g, "");
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {NODES.map((node) => {
        const isActive = node.id === activeId;
        const Icon = node.icon;
        const panelId = `cap-panel-${reactId}-${node.id}`;
        return (
          <li
            key={node.id}
            className="flex flex-col rounded-(--r-glass) border border-jce-dark-line bg-jce-dark-2/70 p-5 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => onToggle(node.id)}
              aria-expanded={isActive}
              aria-controls={panelId}
              className="focus-ring-cyan flex w-full items-start gap-3 rounded-(--r-input) text-left"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-jce-dark-line bg-jce-dark/50 text-jce-cyan-bright sm:size-14">
                <Icon className="size-6 sm:size-7" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-ui-16 leading-snug font-semibold text-balance text-jce-dark-ink">
                  {node.title}
                </span>
                <span className="mt-1.5 block text-ui-13 text-pretty text-jce-dark-ink-2">
                  {node.blurb}
                </span>
              </span>
            </button>

            <div
              id={panelId}
              className={cn("mt-3", isActive ? "block" : "hidden")}
            >
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-(--r-input) border border-jce-dark-line">
                <Image
                  src={node.img}
                  alt={node.imgAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <RelatedLinks related={node.related} onSelect={onSelect} />
              <ExploreLink href={node.href} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ── Shared leaves ─────────────────────────────────────────────────────────────
function RelatedLinks({
  related,
  onSelect,
}: {
  related: readonly string[];
  onSelect: (id: string) => void;
}) {
  const items = related
    .map(byId)
    .filter((n): n is CapabilityNode => Boolean(n));
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="kicker text-jce-dark-ink-2">Related</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.id)}
            className="focus-ring-cyan inline-flex min-h-11 items-center rounded-(--r-pill) border border-jce-dark-line bg-jce-dark/40 px-3 text-ui-12 font-medium text-jce-dark-ink-2 transition-colors hover:border-jce-cyan/50 hover:text-jce-cyan-bright"
          >
            {n.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function ExploreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="focus-ring-cyan mt-4 inline-flex min-h-11 items-center gap-1.5 text-ui-13 font-semibold text-jce-cyan-bright"
    >
      Explore
      <ArrowRightIcon className="size-3.5" aria-hidden />
    </Link>
  );
}
