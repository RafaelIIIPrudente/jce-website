import { describe, expect, it } from "vitest";

import {
  addRequest,
  autoCreateLeaveRowsForRange,
  getRequestById,
  getRequests,
  getTimeRowsForEmployee,
  updateRequest,
  workingDaysBetween,
  type RequestInput,
} from "@/lib/mock/hr";

// H7–H11 · HR Requests (SRS §4.3). The decisive guards: working-day computation,
// idempotent full-range auto-create, and store CRUD / deep-link resolution.

describe("workingDaysBetween", () => {
  it("counts Mon–Sat, excludes a spanned Sunday, handles single + reversed", () => {
    // 2026-05-31 is a Sunday (anchor), so 2026-06-01 is Monday.
    expect(workingDaysBetween("2026-06-01", "2026-06-06")).toHaveLength(6); // Mon–Sat
    expect(workingDaysBetween("2026-06-01", "2026-06-07")).toHaveLength(6); // Sun 07 excluded
    expect(workingDaysBetween("2026-06-05", "2026-06-08")).toEqual([
      "2026-06-05",
      "2026-06-06",
      "2026-06-08",
    ]); // Fri, Sat, (Sun excl), Mon
    expect(workingDaysBetween("2026-06-03", "2026-06-03")).toEqual([
      "2026-06-03",
    ]);
    expect(workingDaysBetween("2026-06-06", "2026-06-01")).toEqual([]); // reversed
    expect(workingDaysBetween("", "2026-06-03")).toEqual([]);
  });
});

describe("autoCreateLeaveRowsForRange", () => {
  it("creates exactly one row per working day with the ref, and is idempotent", () => {
    const empNo = "JCE 00009";
    const ref = "TEST-RFL-AUTO-1";
    const from = "2026-07-06";
    const to = "2026-07-10";
    const expected = workingDaysBetween(from, to).length;

    const created = autoCreateLeaveRowsForRange({
      empNo,
      from,
      to,
      leave: "Leave With Pay",
      ref,
    });
    expect(created).toBe(expected);

    const rows = getTimeRowsForEmployee(empNo).filter(
      (r) => r.leaveRef === ref,
    );
    expect(rows).toHaveLength(expected);
    expect(rows.every((r) => r.leave === "Leave With Pay")).toBe(true);

    // Idempotent: re-running for the same ref adds nothing.
    const again = autoCreateLeaveRowsForRange({
      empNo,
      from,
      to,
      leave: "Leave With Pay",
      ref,
    });
    expect(again).toBe(0);
    expect(
      getTimeRowsForEmployee(empNo).filter((r) => r.leaveRef === ref),
    ).toHaveLength(expected);
  });
});

describe("request store CRUD + resolution", () => {
  const input: RequestInput = {
    no: "OB-TEST-900",
    filed: "2026-06-03",
    type: "OB/Travel",
    status: "Pending",
    employees: [
      {
        no: "JCE 00055",
        name: "Paolo R. Garcia",
        pos: "Site Engineer",
        assign: "26-05-378 · 13.2KV Distribution Line",
      },
    ],
    signers: [{ role: "Requester" }],
    scans: [],
    details: {
      kind: "ob",
      reasons: "Inspection",
      projectName: "13.2KV Distribution Line",
      salesOrderNo: "26-05-378",
      destination: "Bulacan",
      departAt: "2026-06-03T07:00",
      returnAt: "2026-06-03T17:00",
    },
  };

  it("addRequest derives a URL-safe id resolvable via getRequestById + getRequests", () => {
    const created = addRequest(input);
    expect(created.id).toMatch(/^[a-z0-9-]+$/);
    expect(created.emp).toBe("Paolo R. Garcia");
    expect(created.scan).toBe(false);

    const resolved = getRequestById("OB/Travel", created.id);
    expect(resolved?.no).toBe("OB-TEST-900");
    expect(getRequests("OB/Travel").some((r) => r.id === created.id)).toBe(
      true,
    );
  });

  it("updateRequest patches status + re-derives scan", () => {
    const created = addRequest({ ...input, no: "OB-TEST-901" });
    const updated = updateRequest(created.id, {
      status: "Approved",
      scans: [{ name: "signed.pdf", kind: "pdf" }],
    });
    expect(updated?.status).toBe("Approved");
    expect(updated?.scan).toBe(true);
    expect(getRequestById("OB/Travel", created.id)?.status).toBe("Approved");
  });

  it("assigns unique ids even when two records share the same form number", () => {
    const a = addRequest({ ...input, no: "OB-DUP-1" });
    const b = addRequest({ ...input, no: "OB-DUP-1" });
    expect(a.id).not.toBe(b.id);
  });
});
