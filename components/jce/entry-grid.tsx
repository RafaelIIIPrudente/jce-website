"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { FieldComputed } from "@/components/jce/field-computed";

// Entry grid — keyboard-first cell editing (Foundations.html:593-608). Used on
// H5 timekeeping, P8 accomplishment, A16 JV. Editable cells accept input; derived
// columns render the read-only `.computed` hatch and are recomputed live (hard
// rule: derived values are never editable). Arrow keys / Enter move between cells.
// Tag: Solid.

export type EntryColumn<T extends Record<string, string>> = {
  id: keyof T & string;
  header: React.ReactNode;
  editable?: boolean;
  compute?: (row: T) => React.ReactNode;
  align?: "left" | "right";
  placeholder?: string;
};

export function EntryGrid<T extends Record<string, string>>({
  columns,
  initialRows,
  getRowKey,
  className,
}: {
  columns: readonly EntryColumn<T>[];
  initialRows: readonly T[];
  getRowKey?: (row: T, index: number) => React.Key;
  className?: string;
}) {
  const [rows, setRows] = useState<T[]>(() =>
    initialRows.map((r) => ({ ...r })),
  );
  const editableCols = columns.filter((c) => c.editable);
  const refs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  const cellKey = (r: number, ci: number) => `${r}:${ci}`;
  const focusCell = (r: number, ci: number) => {
    const el = refs.current.get(cellKey(r, ci));
    if (el) {
      el.focus();
      el.select();
    }
  };

  const setCell = (r: number, id: keyof T & string, value: string) =>
    setRows((rs) =>
      rs.map((row, i) => (i === r ? { ...row, [id]: value } : row)),
    );

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    r: number,
    ci: number,
  ) => {
    const el = e.currentTarget;
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      focusCell(r + 1, ci);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusCell(r - 1, ci);
    } else if (e.key === "ArrowLeft" && el.selectionStart === 0) {
      e.preventDefault();
      focusCell(r, ci - 1);
    } else if (
      e.key === "ArrowRight" &&
      el.selectionStart === el.value.length
    ) {
      e.preventDefault();
      focusCell(r, ci + 1);
    }
  };

  return (
    <div
      data-slot="entry-grid"
      className={cn("solid overflow-auto p-0", className)}
    >
      <table className="jtable">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.id}
                className={cn(c.align === "right" && "text-right")}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={getRowKey ? getRowKey(row, r) : r}>
              {columns.map((c) => {
                if (c.editable) {
                  const ci = editableCols.findIndex((ec) => ec.id === c.id);
                  return (
                    <td key={c.id} className={cn(c.align === "right" && "num")}>
                      <input
                        ref={(el) => {
                          refs.current.set(cellKey(r, ci), el);
                        }}
                        value={row[c.id]}
                        placeholder={c.placeholder}
                        onChange={(e) => setCell(r, c.id, e.target.value)}
                        onKeyDown={(e) => onKeyDown(e, r, ci)}
                        className={cn(
                          "w-full rounded-[4px] bg-transparent px-1 py-0.5 text-ui-13 text-jce-ink outline-none focus:bg-jce-green-50 focus-visible:shadow-[var(--focus-ring)]",
                          c.align === "right" &&
                            "text-right font-mono tabular-nums",
                        )}
                      />
                    </td>
                  );
                }
                if (c.compute) {
                  return (
                    <td key={c.id} className={cn(c.align === "right" && "num")}>
                      <FieldComputed>{c.compute(row)}</FieldComputed>
                    </td>
                  );
                }
                return (
                  <td key={c.id} className={cn(c.align === "right" && "num")}>
                    {row[c.id]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
