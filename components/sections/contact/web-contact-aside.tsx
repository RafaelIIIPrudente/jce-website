import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { SITE } from "@/lib/content/site";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import { ElectrifiedDivider } from "@/components/sections/kit/web-electrified-divider";

// S8 Contact aside — the canonical NAP (Office / Phone / Email / Hours from SITE)
// plus the one-business-day note, lifted to the premium circuit-card glass surface
// that matches About's light cards. A faint corner Ω watermark (decorative,
// clipped) and a current-divider seam carry the electrified accent; copy is
// verbatim from SITE. Light surface → focus-ring-jce, 44px link targets.

export function ContactAside() {
  return (
    <aside className="circuit-card glass relative isolate flex h-full flex-col gap-6 rounded-(--r-glass) p-6 sm:p-7">
      {/* Faint corner Ω — decorative, behind content, clipped to the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-(--r-glass)"
      >
        <OmegaMark className="absolute -right-10 -bottom-10 size-44 text-jce-cyan/5" />
      </div>

      <InfoBlock icon={MapPinIcon} label="Office">
        {SITE.address.line1}
        <br />
        {SITE.address.line2}
        <br />
        {SITE.address.country}
      </InfoBlock>
      <InfoBlock icon={PhoneIcon} label="Phone">
        <a
          href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
          className="focus-ring-jce inline-flex min-h-11 items-center rounded-md transition-colors hover:text-jce-green-700"
        >
          {SITE.phone}
        </a>
      </InfoBlock>
      <InfoBlock icon={MailIcon} label="Email">
        <a
          href={`mailto:${SITE.email}`}
          className="focus-ring-jce inline-flex min-h-11 items-center rounded-md transition-colors hover:text-jce-green-700"
        >
          {SITE.email}
        </a>
      </InfoBlock>
      <InfoBlock icon={ClockIcon} label="Hours">
        {SITE.hours.days} · {SITE.hours.open}
      </InfoBlock>

      <ElectrifiedDivider className="mt-auto" />
      <div className="rounded-(--r-solid) border border-jce-line bg-card p-4 text-ui-12 text-jce-ink-2">
        We respond inside one business day during {SITE.hours.days}.
      </div>
    </aside>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPinIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-(--r-solid) bg-jce-green-50 text-jce-green-700">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <div className="text-[11px] tracking-[0.16em] text-jce-ink-2 uppercase">
          {label}
        </div>
        <div className="mt-1 text-ui-14 text-jce-ink">{children}</div>
      </div>
    </div>
  );
}
