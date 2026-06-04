import { cn } from "@/lib/utils";

// Comparison matrix — best-value highlight (Foundations.html:229-234,728-742).
// Used on B6 (offer comparison) and U16 (RFQ matrix). The winning column header
// and best cells are tinted green. Tag: Solid.

export type MatrixColumn = {
  id: string;
  label: React.ReactNode;
  winner?: boolean;
};
export type MatrixCell = {
  value: React.ReactNode;
  best?: boolean;
  align?: "left" | "right";
};
export type MatrixRow = {
  label: React.ReactNode;
  cells: readonly MatrixCell[];
};

export function ComparisonMatrix({
  rowHeader = "Item",
  columns,
  rows,
  className,
}: {
  rowHeader?: React.ReactNode;
  columns: readonly MatrixColumn[];
  rows: readonly MatrixRow[];
  className?: string;
}) {
  return (
    <div
      data-slot="comparison-matrix"
      className={cn("solid overflow-x-auto p-0", className)}
    >
      <table className="w-full border-collapse text-ui-12">
        <thead>
          <tr>
            <th className="border border-jce-line bg-(--table-head) px-2.5 py-2 text-left font-semibold text-jce-ink-2">
              {rowHeader}
            </th>
            {columns.map((c) => (
              <th
                key={c.id}
                className={cn(
                  "border border-jce-line px-2.5 py-2 text-left font-semibold",
                  c.winner
                    ? "bg-jce-green-50 text-jce-green-900"
                    : "bg-(--table-head) text-jce-ink-2",
                )}
              >
                {c.label}
                {c.winner ? " ✓" : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <td className="border border-jce-line px-2.5 py-2 font-medium text-jce-ink">
                {r.label}
              </td>
              {r.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "border border-jce-line px-2.5 py-2 text-jce-ink",
                    cell.align === "right" &&
                      "text-right font-mono tabular-nums",
                    cell.best &&
                      "bg-jce-green-50 font-semibold text-jce-green-900",
                  )}
                >
                  {cell.value}
                  {cell.best ? (
                    <span className="ml-1 align-middle text-[9px] font-bold text-jce-green-700">
                      BEST
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
