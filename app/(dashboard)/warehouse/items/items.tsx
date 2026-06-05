"use client";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  WH_ITEMS,
  itemAvailable,
  nextItemCode,
  isDuplicateItemCode,
  type WhItem,
} from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";

// W3 · Inventory item master (wh-core.jsx:318). On-hand / Available DERIVE from
// movements (never typed); Available = on_hand − reserved, red when negative.
// Item codes are system-generated; duplicate-active prevention on create.
export function ItemMaster() {
  const { role } = useJce();
  const canAdd = canEdit(role, "wh");
  const [items, setItems] = useState<WhItem[]>(() => [...WH_ITEMS]);

  const addItem = () => {
    const code = nextItemCode(items);
    if (isDuplicateItemCode(code, items)) {
      toast.error(
        "Duplicate active code — blocked (system prevents collisions).",
      );
      return;
    }
    setItems((xs) => [
      ...xs,
      {
        code,
        desc: "New inventory item",
        unit: "pcs",
        main: 0,
        sites: 0,
        reserved: 0,
        cat: "Uncategorized",
      },
    ]);
    toast.success(
      `Item ${code} created (system-generated code; 0 on-hand until a receipt Locks).`,
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W3"
        title="Inventory item master"
        actions={
          canAdd ? (
            <Button size="sm" onClick={addItem}>
              + Add item
            </Button>
          ) : null
        }
      />

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item code</th>
              <th>Description</th>
              <th>Unit</th>
              <th className="num">Main Office</th>
              <th className="num">Sites</th>
              <th className="num">Reserved</th>
              <th className="num">Available</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const avail = itemAvailable(it);
              return (
                <tr key={it.code}>
                  <td className="mono font-semibold">{it.code}</td>
                  <td className="font-semibold">{it.desc}</td>
                  <td>{it.unit}</td>
                  <td className="num">
                    <span className="computed">{qn(it.main)}</span>
                  </td>
                  <td className="num">
                    <span className="computed">{qn(it.sites)}</span>
                  </td>
                  <td className="num">{qn(it.reserved)}</td>
                  <td className="num font-bold">
                    <span
                      className={cn(
                        "computed",
                        avail < 0 && "text-(--st-danger)",
                      )}
                    >
                      {qn(avail)}
                    </span>
                  </td>
                  <td className="text-jce-ink-2">{it.cat}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        On-hand ({"{Main + Sites}"}) and Available ({"on_hand − reserved"}) are
        derived from movements — never typed. Item codes are system-generated;
        duplicate-code prevention on create.
      </p>
    </div>
  );
}
