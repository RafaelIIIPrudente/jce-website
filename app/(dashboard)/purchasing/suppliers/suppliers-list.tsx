"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { SUPPLIERS } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";

// U9 · Suppliers list (pur-core.jsx:878). Code JCE 0000X, search, bank-state
// chip. + Add supplier is hidden for read-only roles.
export function SuppliersList() {
  const router = useRouter();
  const { role } = useJce();
  const canAdd = canEdit(role, "pur");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      SUPPLIERS.filter(
        (s) =>
          q === "" ||
          (s.name + s.code + s.cat).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U9"
        title="Suppliers"
        actions={
          <>
            <label className="flex items-center gap-2 rounded-(--r-input) border border-jce-line bg-(--solid-surface) px-2.5 py-1.5">
              <SearchIcon
                className="size-4 shrink-0 text-jce-ink-2"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name, code, category…"
                className="w-44 bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
                aria-label="Search suppliers"
              />
            </label>
            {canAdd ? (
              <Button
                size="sm"
                onClick={() =>
                  toast.info(
                    "Add supplier — duplicate guard checks Name / TIN before save.",
                  )
                }
              >
                + Add supplier
              </Button>
            ) : null}
          </>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="size-6" aria-hidden />}
          title="No suppliers match"
          description="Try a different name, code, or category."
        />
      ) : (
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Code</th>
                <th>Supplier</th>
                <th>TOP</th>
                <th>TIN</th>
                <th>City / Country</th>
                <th>Category</th>
                <th>Offers</th>
                <th>Bank</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.code}
                  onClick={() =>
                    router.push(
                      `/purchasing/suppliers/${encodeURIComponent(s.code)}`,
                    )
                  }
                  className="cursor-pointer"
                >
                  <td className="mono font-semibold">{s.code}</td>
                  <td className="font-semibold">{s.name}</td>
                  <td>{s.top}</td>
                  <td className="mono text-ui-12">{s.tin}</td>
                  <td>{s.city}</td>
                  <td className="text-jce-ink-2">{s.cat}</td>
                  <td>
                    <span className="flex flex-wrap gap-1">
                      {s.offers.map((o) => (
                        <span
                          key={o}
                          className="rounded-(--r-chip) border border-jce-line bg-(--table-zebra) px-1.5 py-0.5 text-[11px] text-jce-ink-2"
                        >
                          {o}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <Chip tone={s.bankPending ? "pending" : "success"}>
                      {s.bankPending ? "pending verify" : "verified"}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
