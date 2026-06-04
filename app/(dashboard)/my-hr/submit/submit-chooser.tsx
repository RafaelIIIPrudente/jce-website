import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  FileMinusIcon,
  PlaneIcon,
} from "lucide-react";

import { REQUEST_TYPES, type RequestTypeLabel } from "@/lib/mock/hr";

// H13 · Submit chooser (hr-requests.jsx:697). Pick a form; after submit the paper
// chain is signed offline, HR uploads the signed scan, and the record flips to
// Approved / Recorded. Server component — pure navigation.

const ICONS: Record<RequestTypeLabel, typeof PlaneIcon> = {
  "OB/Travel": PlaneIcon,
  Overtime: ClockIcon,
  "Request for Leave": CalendarDaysIcon,
  "LOA Without Pay": FileMinusIcon,
};

export function SubmitChooser() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <Link
        href="/my-hr"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        ← My HR
      </Link>
      <div>
        <h1 className="text-ui-28 font-bold tracking-tight text-jce-ink">
          Submit a request
        </h1>
        <p className="mt-1 max-w-prose text-ui-14 text-jce-ink-2">
          Pick a form. After you submit, the paper chain is signed offline; HR
          uploads the signed scan and your record flips to Approved / Recorded.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {REQUEST_TYPES.map((t) => {
          const Icon = ICONS[t.label];
          return (
            <Link
              key={t.slug}
              href={`/hr/requests/${t.slug}/new`}
              className="focus-ring-jce glass flex flex-col gap-2 rounded-(--r-glass) p-5 transition-colors hover:border-jce-green-500"
            >
              <span className="grid size-10 place-items-center rounded-[10px] bg-jce-green-50 text-jce-green-700">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="mt-1 text-ui-16 font-semibold text-jce-ink">
                {t.label}
              </span>
              <span className="text-ui-12 text-jce-ink-2">{t.blurb}</span>
              <span className="mt-1 flex items-center gap-1 text-ui-12 font-semibold text-jce-green-700">
                Start <ArrowRightIcon className="size-3.5" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
