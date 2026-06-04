"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { CATALOG_TREE, CATALOG_ITEMS } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { EmptyState } from "@/components/jce/empty-state";

// U17 · Item / material catalog (pur-phase2a.jsx:324). Two-level taxonomy tree;
// promote an ad-hoc PO/RFQ line to the catalog in one click.
export function Catalog() {
  const { role } = useJce();
  const canAdd = canEdit(role, "pur");
  const [cat, setCat] = useState("All");

  const rows = useMemo(
    () => CATALOG_ITEMS.filter((i) => cat === "All" || i.cat === cat),
    [cat],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U17 · Phase 2"
        title="Item / material catalog"
        actions={
          canAdd ? (
            <Button
              size="sm"
              onClick={() =>
                toast.info("Add item — or promote an ad-hoc line.")
              }
            >
              + Add item
            </Button>
          ) : null
        }
      />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="glass-nav flex flex-col gap-0.5 rounded-(--r-glass) p-2">
          <div className="kicker px-2 py-1">Taxonomy</div>
          {CATALOG_TREE.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCat(t)}
              className={cn(
                "focus-ring-jce rounded-(--r-chip) px-2.5 py-1.5 text-left text-ui-12 font-medium transition-colors",
                cat === t
                  ? "bg-jce-green-700 text-primary-foreground"
                  : "text-jce-ink-2 hover:text-jce-green-900",
              )}
            >
              {t === "All" ? "All items" : t.split(" > ").slice(-1)[0]}
              {t !== "All" ? (
                <span className="block text-[9px] opacity-70">{t}</span>
              ) : null}
            </button>
          ))}
        </nav>
        {rows.length === 0 ? (
          <EmptyState
            title="No items in this category"
            description="Pick another branch of the taxonomy, or add the first item here."
          />
        ) : (
          <div className="solid overflow-auto rounded-(--r-solid) p-0">
            <table className="jtable">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>UOM</th>
                  <th>Category</th>
                  <th>Preferred supplier</th>
                  <th className="num">Last price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((it) => (
                  <tr key={it.code}>
                    <td className="mono font-semibold">{it.code}</td>
                    <td className="font-semibold">{it.name}</td>
                    <td>{it.uom}</td>
                    <td className="text-ui-12 text-jce-ink-2">{it.cat}</td>
                    <td>{it.supplier}</td>
                    <td className="num">{it.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
