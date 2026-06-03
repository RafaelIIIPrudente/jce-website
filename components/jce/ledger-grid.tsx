import { cn } from "@/lib/utils";

// Ledger / register grid — the generic solid `.jtable` register (Foundations.html
// "Data table / register" + "Ledger grid"). Sticky head, zebra rows, hover-focus,
// right-aligned tabular numerals. Base for every list: H1, A4/A7/A10, U2, W2/W4,
// B1, P9, A3. Typed columns with a cell accessor. Tag: Solid.

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
  className,
}: {
  columns: readonly LedgerColumn<T>[];
  rows: readonly T[];
  getRowKey?: (row: T, index: number) => React.Key;
  className?: string;
}) {
  return (
    <div
      data-slot="ledger-grid"
      className={cn("solid max-h-[420px] overflow-auto p-0", className)}
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
          {rows.map((row, i) => (
            <tr key={getRowKey ? getRowKey(row, i) : i}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
