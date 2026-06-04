import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// Branded dynamic Open Graph card for the marketing site (home flagship; the
// file-convention also serves as the default OG for sibling marketing routes).
// Node runtime so we can read local Inter TTFs for crisp type (Satori needs
// ttf/otf/woff — not woff2). 1200×630, mirrors the on-site .dark-section look.

export const runtime = "nodejs";
export const alt =
  "JC Electrofields Power System — power infrastructure engineered to energize";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ──────────────────────────────────────────────────────────────────────────
// SCOPED NO-HEX EXCEPTION (documented): Satori/ImageResponse renders inline
// style objects with literal colours and is NOT Tailwind / not the lint surface,
// so CSS custom properties (var(--…)) cannot be used here. These constants MIRROR
// the app/globals.css :root tokens and MUST be kept in sync if those change.
// (Hex in a TS literal is not flagged by the suggestCanonicalClasses rule, so no
// eslint-disable is required; the mapping comment is the contract.)
//   jce-dark #0a140e · jce-dark-2 #112218 · jce-dark-ink #eaf5ee
//   jce-dark-ink-2 #9fbcab · jce-dark-line rgba(255,255,255,.1)
//   accent (ORANGE): jce-cyan→jce-orange-600 #de6f11 · jce-cyan-bright→jce-orange-500 #fa8838
// ──────────────────────────────────────────────────────────────────────────
const C = {
  dark: "#0a140e",
  ink: "#eaf5ee",
  ink2: "#9fbcab",
  line: "rgba(255,255,255,0.10)",
  cyan: "#de6f11",
  cyanBright: "#fa8838",
  gridLine: "rgba(255,255,255,0.045)",
  glow: "rgba(222,111,17,0.18)",
} as const;

export default async function OpengraphImage() {
  const [regular, semibold, bold] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/Inter-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/fonts/Inter-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 76px",
        backgroundColor: C.dark,
        backgroundImage: `radial-gradient(circle at 80% 12%, ${C.glow}, transparent 46%), linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        fontFamily: "Inter",
        color: C.ink,
      }}
    >
      {/* Top — Ω mark + brand lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="60" height="58" viewBox="0 0 100 96" fill="none">
          <path
            d="M30 80 C6 68 6 26 50 14 C94 26 94 68 70 80 M30 80 H17 M70 80 H83"
            stroke={C.cyanBright}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>
            JC Electrofields Power System, Inc.
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: C.ink2 }}>
            Electrical power systems EPC · Philippines
          </div>
        </div>
      </div>

      {/* Middle — positioning headline */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: 62,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: C.ink,
        }}
      >
        <span>Power infrastructure,&nbsp;</span>
        <span style={{ color: C.cyanBright }}>engineered to energize.</span>
      </div>

      {/* Bottom — hairline accent + credentials */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            height: 2,
            width: "100%",
            backgroundImage: `linear-gradient(90deg, ${C.cyan}, ${C.line})`,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          <span style={{ color: C.ink }}>Since 1997</span>
          <span style={{ color: C.cyan }}>·</span>
          <span style={{ color: C.ink }}>up to 230 kV</span>
          <span style={{ color: C.cyan }}>·</span>
          <span style={{ color: C.ink }}>45+ projects nationwide</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
