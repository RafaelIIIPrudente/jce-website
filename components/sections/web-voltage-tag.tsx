import { cn } from "@/lib/utils";

// Glowing spec/voltage badge atom — "230 kV", "120 MWp", "300 MVA". Pure CSS
// (.voltage-tag), no JS: a mono label with a leading cyan "current node" dot.
// Light-surface by default; tone="dark" glows on near-black sections. The glow
// is decorative (text-shadow/box-shadow); the label text itself stays AA-legible.

export function VoltageTag({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "voltage-tag",
        tone === "dark" && "voltage-tag-dark",
        className,
      )}
    >
      {children}
    </span>
  );
}
