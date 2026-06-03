import { cn } from "@/lib/utils";

// Computed / derived read-only value — the 135° hatch identity shared by every
// derived number in the system (stock balances, BOQ weights, payment status,
// totals, variance). Hard rule: derived values are NEVER editable, so this has
// no input affordance. (jce-tokens.css:251-255 · Foundations.html:601-602,617)
// Tag: Solid.

export function FieldComputed({
  children,
  title = "Computed — derived, read-only",
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <span
      data-slot="field-computed"
      data-computed
      title={title}
      className={cn(
        "computed inline-flex items-center text-ui-13 leading-tight",
        className,
      )}
    >
      {children}
    </span>
  );
}
