"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { COA } from "@/lib/mock/accounting";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";

// A2 · Chart of Accounts (acc-payroll.jsx:616). Fuzzy search (e.g. "meal" → 50032),
// band groups; inactivate-never-delete when posted against. +Add = acctglead/owner.
export function ChartOfAccounts() {
  const { role } = useJce();
  const canManage = canVerb(role, "acc");
  const [q, setQ] = useState("");

  const ql = q.toLowerCase();
  const bands = COA.map((g) => ({
    band: g.band,
    rows: g.rows.filter(
      (r) => q === "" || `${r.code}${r.name}`.toLowerCase().includes(ql),
    ),
  })).filter((g) => g.rows.length > 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A2"
        title="Chart of Accounts"
        description="Codes manually assigned · inactivate-never-delete when posted against (SET-081)."
        actions={
          <>
            <div className="flex h-9 w-64 items-center gap-2 rounded-[8px] border border-jce-line bg-white/70 px-2.5">
              <SearchIcon
                className="size-4 shrink-0 text-jce-ink-2"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Fuzzy — e.g. ‘meal’ finds 50032…"
                aria-label="Search accounts"
                className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
              />
            </div>
            {canManage ? <Button size="sm">+ Add account</Button> : null}
          </>
        }
      />

      {bands.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-2">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No accounts match"
            description={`Nothing in the chart matches “${q}”. Try an account name or code.`}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {bands.map((g) => (
            <section key={g.band} className="flex flex-col gap-2">
              <div className="kicker text-jce-green-600">{g.band}</div>
              <div className="solid overflow-auto rounded-(--r-solid) p-0">
                <table className="jtable">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Account name</th>
                      <th>Type</th>
                      <th>Subtype</th>
                      <th>Normal balance</th>
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r) => (
                      <tr key={r.code}>
                        <td className="font-mono font-semibold">{r.code}</td>
                        <td className="text-jce-ink">{r.name}</td>
                        <td>{r.type}</td>
                        <td className="text-jce-ink-2">{r.subtype}</td>
                        <td>
                          <Chip
                            tone={r.normal === "Debit" ? "info" : "neutral"}
                          >
                            {r.normal}
                          </Chip>
                        </td>
                        <td>
                          <Chip tone="success">Active</Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
