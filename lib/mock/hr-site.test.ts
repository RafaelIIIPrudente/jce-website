import { describe, expect, it } from "vitest";

import {
  DEFAULT_SITE_HOURS,
  LEGACY_EMP_NO,
  SITE_STANDARD_HOURS,
  addHoursToTime,
  addSiteDayRows,
  buildSiteDayRows,
  computeManhours,
  getTimeRowsForEmployee,
  isSunday,
  rowDistribution,
  standardHoursForSite,
  weekdayOf,
  weekTotals,
  type TimeRow,
} from "@/lib/mock/hr";

// H5b · Site Day Sheet model. Guards the sibling-clause fix (the load-bearing
// even-split change), TZ-safe day inference, and the OT-minutes helper.

describe("(a) site standard hours yield a clean 8h Regular Day", () => {
  const pairs = [DEFAULT_SITE_HOURS, ...Object.values(SITE_STANDARD_HOURS)];
  it("every standard pair → {reg:8, ot:0, nd:0, abs:0}", () => {
    for (const p of pairs) {
      expect(computeManhours(p.in, p.out, "Regular Day")).toEqual({
        reg: 8,
        ot: 0,
        nd: 0,
        abs: 0,
      });
    }
    // Main Office explicitly.
    expect(standardHoursForSite("Main Office")).toEqual({
      in: "08:00",
      out: "17:00",
    });
  });
});

describe("(b) rowDistribution splits by (empNo,date) — own sibling count", () => {
  it("three different employees, same date → each keeps the FULL 8h (not /3)", () => {
    const rows: TimeRow[] = [
      mk(1, "A", "2026-06-10", "07:00", "16:00"),
      mk(2, "B", "2026-06-10", "07:00", "16:00"),
      mk(3, "C", "2026-06-10", "07:00", "16:00"),
    ];
    for (const r of rows) {
      expect(rowDistribution(r, rows).reg).toBe(8);
    }
  });

  it("one employee, two same-date project rows → split in half (4 each)", () => {
    const rows: TimeRow[] = [
      mk(1, "A", "2026-06-10", "07:00", "16:00"),
      mk(2, "A", "2026-06-10", "07:00", "16:00"),
    ];
    expect(rowDistribution(rows[0]!, rows).reg).toBe(4);
    expect(rowDistribution(rows[1]!, rows).reg).toBe(4);
  });
});

describe("(c) legacy week totals are byte-identical (regression guard)", () => {
  it("the 8 seed rows still total {reg:35, ot:4, nd:6, abs:3}", () => {
    const legacy = getTimeRowsForEmployee(LEGACY_EMP_NO);
    expect(legacy.length).toBe(8);
    expect(weekTotals(legacy)).toEqual({ reg: 35, ot: 4, nd: 6, abs: 3 });
  });
});

describe("(d) TZ-safe day inference", () => {
  it("Sunday detection + weekday name are stable (local parse)", () => {
    expect(isSunday("2026-05-31")).toBe(true); // an actual Sunday
    expect(isSunday("2026-06-03")).toBe(false); // HR_TODAY (Wed)
    expect(weekdayOf("2026-05-25")).toBe("Mon");
    expect(weekdayOf("2026-06-03")).toBe("Wed"); // HR_TODAY
  });
});

describe("(e) addHoursToTime wraps and no-ops cleanly", () => {
  it("a 22:00→06:00 row's out (06:00) + N stays a valid HH:MM", () => {
    expect(addHoursToTime("06:00", 2)).toBe("08:00");
    expect(addHoursToTime("22:00", 6)).toBe("04:00"); // wraps past midnight
    expect(addHoursToTime("—", 2)).toBeNull(); // Absent — no-op
    expect(addHoursToTime("7am", 2)).toBeNull(); // invalid — no-op
  });
});

describe("buildSiteDayRows / addSiteDayRows", () => {
  it("On Leave → Leave row, Suspended/Present → standard hours; idempotent upsert", () => {
    const built = buildSiteDayRows({ site: "Workshop", date: "2026-06-10" });
    expect(built.length).toBeGreaterThan(0);
    const onLeave = built.find((r) => r.empNo === "JCE 00062"); // Danilo, On Leave
    expect(onLeave?.leave).toBe("On Leave");
    expect(onLeave?.in).toBe("—");
    const present = built.find((r) => r.empNo === "JCE 00081"); // Roberto, Workshop
    expect(present?.in).toBe("07:00");
    expect(built.every((r) => r.site === "Workshop")).toBe(true);

    const first = addSiteDayRows({ site: "Workshop", date: "2026-06-11" });
    expect(first.added).toBeGreaterThan(0);
    const second = addSiteDayRows({ site: "Workshop", date: "2026-06-11" });
    expect(second.added).toBe(0); // idempotent — no duplicates
  });
});

function mk(
  id: number,
  empNo: string,
  date: string,
  inT: string,
  outT: string,
): TimeRow {
  return {
    id,
    empNo,
    date,
    day: weekdayOf(date),
    dayType: "Regular Day",
    proj: "26-05-378",
    in: inT,
    out: outT,
    leave: null,
    remarks: "",
  };
}
