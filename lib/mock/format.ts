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
