import { cn } from "@/lib/utils";

// Ledger / register grid — the generic solid `.jtable` register (Foundations.html
// "Data table / register" + "Ledger grid"). Sticky head, zebra rows, hover-focus,
// right-aligned tabular numerals. Base for every list: H1, A4/A7/A10, U2, W2/W4,
// B1, P9, A3, and the X notifications / users / settings tables. Typed columns
// with a cell accessor; optional row interaction (click + active highlight). Solid.

export type LedgerColumn<T> = {
  id: string;
  header: React.ReactNode;
  align?: "left" | "right" | "center";
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export function LedgerGrid<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  activeRowKey,
  className,
}: {
  columns: readonly LedgerColumn<T>[];
  rows: readonly T[];
  getRowKey?: (row: T, index: number) => React.Key;
  /** makes rows clickable (and keyboard-activatable) */
  onRowClick?: (row: T, index: number) => void;
  /** highlights the row whose key matches */
  activeRowKey?: React.Key;
  className?: string;
}) {
  const interactive = Boolean(onRowClick);
  return (
    <div
      data-slot="ledger-grid"
      className={cn("solid max-h-105 overflow-auto p-0", className)}
    >
      <table className="jtable">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.id}
                className={cn(
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  c.headerClassName,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = getRowKey ? getRowKey(row, i) : i;
            const active = activeRowKey != null && key === activeRowKey;
            return (
              <tr
                key={key}
                data-active={active || undefined}
                tabIndex={interactive ? 0 : undefined}
                onClick={interactive ? () => onRowClick?.(row, i) : undefined}
                onKeyDown={
                  interactive
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick?.(row, i);
                        }
                      }
                    : undefined
                }
                className={cn(
                  interactive && "focus-ring-jce cursor-pointer outline-none",
                  active && "[&>td]:bg-jce-green-100",
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.id}
                    className={cn(
                      c.align === "right" && "num",
                      c.align === "center" && "text-center",
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
