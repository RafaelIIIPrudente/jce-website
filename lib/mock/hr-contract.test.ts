import { describe, expect, it } from "vitest";

import {
  HR_TODAY,
  addMonths,
  findEmployee,
  getContractExtensions,
  renewContract,
} from "@/lib/mock/hr";

// Contract-renewal logic (HR-head requirement). Each `it` renews a DISTINCT
// contractual employee so the in-session store mutations don't cross tests;
// Vitest isolates this file's module from the other hr tests.

describe("addMonths — deterministic month math", () => {
  it("clamps the day on month-end overflow (Jan 31 +1 → Feb 28)", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
  });
  it("adds 3 and 6 months from the JCE anchor", () => {
    expect(addMonths(HR_TODAY, 3)).toBe("2026-09-03");
    expect(addMonths(HR_TODAY, 6)).toBe("2026-12-03");
  });
  it("handles negative months and year rollover", () => {
    expect(addMonths("2026-06-03", -2)).toBe("2026-04-03");
    expect(addMonths("2026-12-15", 1)).toBe("2027-01-15");
  });
});

describe("renewContract — extends from the renewal date", () => {
  it("renews by 3 months, captures the previous end, updates the store + history", () => {
    const before = findEmployee(13); // JCE 01000, contractual
    expect(before?.type).toBe("Contractual");
    const prevEnd = before?.contractEnd;
    const ext = renewContract({ empNo: "JCE 01000", term: 3, by: "Test HR" });
    expect(ext.term).toBe(3);
    expect(ext.newEnd).toBe(addMonths(HR_TODAY, 3));
    expect(ext.previousEnd).toBe(prevEnd);
    // contractEnd updated in the store
    expect(findEmployee(13)?.contractEnd).toBe(addMonths(HR_TODAY, 3));
    // appears newest-first in history
    expect(getContractExtensions("JCE 01000")[0]?.id).toBe(ext.id);
  });

  it("renews by 6 months from the renewal date", () => {
    const ext = renewContract({ empNo: "JCE 01005", term: 6, by: "Test HR" });
    expect(ext.newEnd).toBe(addMonths(HR_TODAY, 6));
    expect(findEmployee(18)?.contractEnd).toBe(addMonths(HR_TODAY, 6));
  });

  it("captures a lapsed/expired previous end and still renews", () => {
    // First renewal → end 2026-09-03; renew again from a LATER date so the
    // captured previous end is already lapsed at the renewal date.
    renewContract({ empNo: "JCE 01010", term: 3, by: "Test HR" });
    const ext = renewContract({
      empNo: "JCE 01010",
      term: 6,
      by: "Test HR",
      on: "2027-01-01",
    });
    expect(ext.previousEnd).toBe(addMonths(HR_TODAY, 3)); // the lapsed end
    expect(ext.newEnd).toBe(addMonths("2027-01-01", 6));
    expect(findEmployee(23)?.contractEnd).toBe(addMonths("2027-01-01", 6));
  });
});
