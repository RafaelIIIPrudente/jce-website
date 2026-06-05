import { describe, expect, it } from "vitest";

import {
  EMPLOYEES,
  computeManhours,
  expiringFlag,
  findEmployee,
  rowDistribution,
  weekTotals,
  type TimeRow,
} from "@/lib/mock/hr";

// First unit test (SRS §4.2 Manhours Distribution) — guards the night-meal ND
// deduction fix and the multi-project even split. Pure logic, no DOM.

function row(over: Partial<TimeRow> & Pick<TimeRow, "id" | "date">): TimeRow {
  return {
    day: "Mon",
    dayType: "Regular Day",
    proj: "26-05-378",
    in: "07:00",
    out: "16:00",
    leave: null,
    remarks: "",
    ...over,
  };
}

describe("computeManhours — Regular/OT/Night-Differential buckets", () => {
  it("(a) SRS worked example 08:00 → 02:00 (next day) ⇒ Reg 8 / OT 8 / ND 3 — night meal NOT spanned (regression guard)", () => {
    const d = computeManhours("08:00", "02:00", "Regular Day");
    expect(d.reg).toBe(8);
    expect(d.ot).toBe(8);
    expect(d.nd).toBe(3);
  });

  it("(b) 22:00 → 06:00 fully spans the 02:00–03:00 night meal ⇒ ND deducts 1h (7 → 6)", () => {
    const d = computeManhours("22:00", "06:00", "Regular Day");
    expect(d.nd).toBe(6); // 23:00–06:00 overlap = 7h, minus the 1h night meal
    expect(d.reg).toBe(6); // 8h elapsed − OT meal − night meal = 6h net
    expect(d.ot).toBe(0);
  });

  it("(c) standard 07:00 → 16:00 day shift ⇒ Reg 8 / OT 0 / ND 0", () => {
    const d = computeManhours("07:00", "16:00", "Regular Day");
    expect(d.reg).toBe(8);
    expect(d.ot).toBe(0);
    expect(d.nd).toBe(0);
  });
});

describe("rowDistribution — multi-project even split", () => {
  it("(d) two same-date rows each get half of the day's distribution", () => {
    const rows: TimeRow[] = [
      row({
        id: 1,
        date: "2026-05-27",
        in: "07:00",
        out: "19:00",
        multi: true,
      }),
      row({
        id: 2,
        date: "2026-05-27",
        proj: "WORKSHOP",
        in: "07:00",
        out: "19:00",
        multi: true,
      }),
    ];

    // The day computes once: 07:00–19:00 = 12h elapsed − 1h lunch = 11h net.
    const day = computeManhours("07:00", "19:00", "Regular Day");
    expect(day.reg).toBe(8);
    expect(day.ot).toBe(3);
    expect(day.nd).toBe(0);

    const first = rows[0];
    expect(first).toBeDefined();
    if (!first) return;
    const split = rowDistribution(first, rows);
    expect(split.reg).toBe(4);
    expect(split.ot).toBe(1.5);
    expect(split.nd).toBe(0);
  });
});

describe("weekTotals — sum of per-row distributions", () => {
  it("sums a day shift + a night shift across the week", () => {
    const rows: TimeRow[] = [
      row({ id: 1, date: "2026-06-01", in: "07:00", out: "16:00" }),
      row({ id: 2, date: "2026-06-02", in: "22:00", out: "06:00" }),
    ];
    const t = weekTotals(rows);
    expect(t.reg).toBe(14); // 8 + 6
    expect(t.ot).toBe(0);
    expect(t.nd).toBe(6); // 0 + 6 (night shift, post-deduction)
  });
});

describe("EMPLOYEES roster — deterministic scale fill (100+)", () => {
  it("appends the generated fill on top of the 12 hand-authored employees", () => {
    expect(EMPLOYEES.length).toBeGreaterThanOrEqual(100);
    // The 12 hand-authored stay first, lowest ids 1..12.
    expect(EMPLOYEES.slice(0, 12).map((e) => e.id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    // ME_ID = 9 (My-HR) is still resolvable.
    expect(findEmployee(9)?.name).toBe("Noel V. Bautista");
  });

  it("is deterministic — the first generated record has stable index-derived fields", () => {
    const first = findEmployee(13);
    expect(first).toBeDefined();
    if (!first) return;
    expect(first.no).toBe("JCE 01000");
    expect(first.bio).toBe("4000");
    expect(first.sss.startsWith("SYN-")).toBe(true);
  });

  it("yields a non-trivial contract-expiry count (drives the danger KPI)", () => {
    const expiring = EMPLOYEES.filter(expiringFlag).length;
    expect(expiring).toBeGreaterThan(5);
  });

  it("has unique employee ids and `no`s across the whole roster", () => {
    expect(new Set(EMPLOYEES.map((e) => e.id)).size).toBe(EMPLOYEES.length);
    expect(new Set(EMPLOYEES.map((e) => e.no)).size).toBe(EMPLOYEES.length);
  });
});
