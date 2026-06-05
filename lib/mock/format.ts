// ============================================================================
// JCE SYSTEM — shared PH money / numeral formatters.
// Ported verbatim from the prototype data modules so every part formats money
// identically. Rules preserved: absolute value, 2 dp, comma thousands,
// NEGATIVES IN PARENTHESES. Tabular figures + JetBrains Mono are applied at the
// call site via the `.money` / `.tnum` / `.computed` classes (see globals.css).
// Pure, typed, no side effects.
// ============================================================================

const PH_LOCALE = "en-PH";

const MONEY_OPTS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

/**
 * "₱13,540,000.00" — peso sign, absolute value, 2 dp.
 * (screens-core.jsx:7 · acc-data.jsx)
 */
export function peso(n: number): string {
  return "₱" + Math.abs(n).toLocaleString(PH_LOCALE, MONEY_OPTS);
}

/**
 * "₱274.1M" / "₱62.0M" / "₱950.0K" — abbreviated peso for KPI / summary tiles,
 * where the precise figure lives on the record. 1 dp; full grouping below ₱1,000.
 * Keeps long totals from overflowing a tile on narrow (mobile) viewports.
 */
export function pesoCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return "₱" + (abs / 1_000_000_000).toFixed(1) + "B";
  if (abs >= 1_000_000) return "₱" + (abs / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return "₱" + (abs / 1_000).toFixed(1) + "K";
  return "₱" + abs.toLocaleString(PH_LOCALE);
}

/**
 * "13,540,000.00" or "(1,700.68)" — no symbol, negatives in parentheses.
 * (acc-data.jsx:4-7)
 */
export function pmoney(n: number, paren = true): string {
  const neg = n < 0;
  const s = Math.abs(n).toLocaleString(PH_LOCALE, MONEY_OPTS);
  return neg && paren ? "(" + s + ")" : s;
}

/** Unsigned 2-dp, no parentheses. (pur-data.jsx:94) */
export function pmoneyU(n: number): string {
  return n.toLocaleString(PH_LOCALE, MONEY_OPTS);
}

export type Currency = "PHP" | "USD";

/** "₱4,200,000.00" / "$128,500.00 USD" — currency-aware amount. (pur-data.jsx:95) */
export function ccyAmt(n: number, currency: Currency): string {
  const symbol = currency === "USD" ? "$" : "₱";
  const suffix = currency === "USD" ? " USD" : "";
  return symbol + pmoneyU(n) + suffix;
}

/** Plain integer / quantity grouping, no decimals. (wh-data.jsx:7) */
export function qn(n: number): string {
  return n.toLocaleString(PH_LOCALE);
}

/**
 * Tabular-numerals class helpers — apply to any cell rendering money, quantities
 * or timestamps so columns align. `.money` also right-aligns + no-wraps.
 */
export const TABULAR = "tabular-nums [font-feature-settings:'tnum']";
export const MONO_TABULAR = "font-mono " + TABULAR;
