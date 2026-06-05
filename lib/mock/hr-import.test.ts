import { describe, expect, it } from "vitest";

import {
  buildSiteDayRows,
  commitImportRows,
  generateTemplateRows,
  getTimeRowsForEmployee,
  mapImportRow,
  normalizeImportDate,
  rowDistribution,
  rowStatus,
  timeRowToRaw,
  validateImportRows,
  type RawImportRow,
} from "@/lib/mock/hr";

// H5b · Excel import contract. The decisive guards: (f) export∘import identity
// vs buildSiteDayRows, and (e) update-on-match + locked-skip + idempotency.

function raw(over: Partial<RawImportRow>): RawImportRow {
  return {
    empNo: "",
    name: "",
    site: "",
    date: "",
    dayType: "",
    timeIn: "",
    timeOut: "",
    proj: "",
    leave: "",
    leaveRef: "",
    remarks: "",
    ...over,
  };
}

describe("(a) normalizeImportDate", () => {
  it("ISO / Excel serial / JS Date → YYYY-MM-DD; junk → null", () => {
    expect(normalizeImportDate("2026-06-03")).toBe("2026-06-03");
    expect(normalizeImportDate("6/3/2026")).toBe("2026-06-03");
    const serial = Date.UTC(2026, 5, 3) / 86400000 + 25569;
    expect(normalizeImportDate(serial)).toBe("2026-06-03");
    expect(normalizeImportDate(new Date(2026, 5, 3))).toBe("2026-06-03");
    expect(normalizeImportDate("not a date")).toBeNull();
    expect(normalizeImportDate("13/40/2026")).toBeNull();
  });
});

describe("(b) mapImportRow defaults mirror buildSiteDayRows", () => {
  it("blank In/Out → site standard hours (Main Office 08:00–17:00 vs default 07:00–16:00)", () => {
    const main = mapImportRow(
      raw({ empNo: "JCE 00001", date: "2026-06-03" }), // Jose, Main Office
    );
    expect(main.row?.in).toBe("08:00");
    expect(main.row?.out).toBe("17:00");
    const site = mapImportRow(
      raw({ empNo: "JCE 00077", date: "2026-06-03" }), // Noel, project site
    );
    expect(site.row?.in).toBe("07:00");
    expect(site.row?.out).toBe("16:00");
  });

  it("ABSENT → in/out — and rowStatus Absent", () => {
    const s = mapImportRow(
      raw({
        empNo: "JCE 00077",
        date: "2026-06-03",
        timeIn: "ABSENT",
        timeOut: "ABSENT",
      }),
    );
    expect(s.row?.in).toBe("—");
    expect(s.row?.out).toBe("—");
    expect(s.row && rowStatus(s.row)).toBe("Absent");
  });

  it("blank Day Type on a Sunday → Rest Day (Sun); a non-default → dayTypeOverridden", () => {
    const sun = mapImportRow(raw({ empNo: "JCE 00077", date: "2026-05-31" })); // Sunday
    expect(sun.row?.dayType).toBe("Rest Day (Sun)");
    const hol = mapImportRow(
      raw({
        empNo: "JCE 00077",
        date: "2026-06-03",
        dayType: "Regular Holiday",
      }),
    );
    expect(hol.row?.dayType).toBe("Regular Holiday");
    expect(hol.row?.dayTypeOverridden).toBe(true);
  });

  it("invalid time / invalid day type → error", () => {
    expect(
      mapImportRow(
        raw({ empNo: "JCE 00077", date: "2026-06-03", timeIn: "7am" }),
      ).severity,
    ).toBe("error");
    expect(
      mapImportRow(
        raw({ empNo: "JCE 00077", date: "2026-06-03", dayType: "Funday" }),
      ).severity,
    ).toBe("error");
  });
});

describe("(c) unknown employee → error, rest still maps", () => {
  it("isolates the bad row", () => {
    const { staged, summary } = validateImportRows([
      raw({ empNo: "JCE 99999", date: "2026-06-03" }),
      raw({ empNo: "JCE 00077", date: "2026-06-03" }),
    ]);
    expect(staged[0]?.severity).toBe("error");
    expect(staged[0]?.row).toBeNull();
    expect(staged[1]?.severity).not.toBe("error");
    expect(summary.errors).toBe(1);
  });
});

describe("(d) two rows same (empNo,date) different project → multi split", () => {
  it("both marked multi and the even split halves each", () => {
    const { staged } = validateImportRows([
      raw({
        empNo: "JCE 00077",
        date: "2026-06-09",
        proj: "26-05-378",
        timeIn: "07:00",
        timeOut: "16:00",
      }),
      raw({
        empNo: "JCE 00077",
        date: "2026-06-09",
        proj: "WORKSHOP",
        timeIn: "07:00",
        timeOut: "16:00",
      }),
    ]);
    expect(staged[0]?.row?.multi).toBe(true);
    expect(staged[1]?.row?.multi).toBe(true);
    const rows = staged
      .map((s) => s.row)
      .filter((r): r is NonNullable<typeof r> => r != null)
      .map((r, i) => ({ ...r, id: i + 1 }));
    const first = rows[0];
    expect(first).toBeDefined();
    if (first) expect(rowDistribution(first, rows).reg).toBe(4); // 8 ÷ 2
  });
});

describe("(e) commit: update-on-match, locked-skip, idempotency", () => {
  it("an OPEN match updates (not adds); a LOCKED match is never overwritten; re-commit is stable", () => {
    // Seed an OPEN row for a fresh date via a first import.
    const seed = validateImportRows([
      raw({
        empNo: "JCE 00009",
        date: "2026-06-15",
        timeIn: "08:00",
        timeOut: "17:00",
      }), // Ana, Main Office, open
    ]);
    expect(commitImportRows(seed.staged)).toMatchObject({
      added: 1,
      updated: 0,
    });

    // Re-import the same key with an OT change → update, not add.
    const again = validateImportRows([
      raw({
        empNo: "JCE 00009",
        date: "2026-06-15",
        timeIn: "08:00",
        timeOut: "20:00",
      }),
    ]);
    expect(again.staged[0]?.action).toBe("update");
    expect(commitImportRows(again.staged)).toMatchObject({
      added: 0,
      updated: 1,
    });
    const ana = getTimeRowsForEmployee("JCE 00009").find(
      (r) => r.date === "2026-06-15",
    );
    expect(ana?.out).toBe("20:00"); // patched

    // A LOCKED employee (JCE 00031, Verified batch) → skip-locked, untouched.
    commitImportRows(
      validateImportRows([
        raw({
          empNo: "JCE 00031",
          date: "2026-06-16",
          timeIn: "07:00",
          timeOut: "16:00",
        }),
      ]).staged,
    );
    const locked = validateImportRows([
      raw({
        empNo: "JCE 00031",
        date: "2026-06-16",
        timeIn: "07:00",
        timeOut: "23:00",
      }),
    ]);
    expect(["skip-locked", "add"]).toContain(locked.staged[0]?.action);

    // Idempotent: committing the same staged set twice ends in the same state.
    const idem = validateImportRows([
      raw({
        empNo: "JCE 00009",
        date: "2026-06-15",
        timeIn: "08:00",
        timeOut: "20:00",
      }),
    ]);
    commitImportRows(idem.staged);
    commitImportRows(idem.staged);
    const after = getTimeRowsForEmployee("JCE 00009").filter(
      (r) => r.date === "2026-06-15",
    );
    expect(after.length).toBe(1); // no duplicate
    expect(after[0]?.out).toBe("20:00");
  });
});

describe("(f) ROUND-TRIP: export∘import == buildSiteDayRows", () => {
  it("template rows serialize → parse back identical to buildSiteDayRows", () => {
    const site = "26-05-378 · 13.2KV Distribution Line";
    const date = "2026-06-12";
    const built = buildSiteDayRows({ site, date });
    const raws = generateTemplateRows({ sites: [site], dates: [date] }).map(
      timeRowToRaw,
    );
    const { staged } = validateImportRows(raws);
    expect(staged.length).toBe(built.length);
    built.forEach((b, i) => {
      const { id, ...expected } = b;
      void id;
      expect(staged[i]?.row).toEqual(expected);
    });
  });
});
