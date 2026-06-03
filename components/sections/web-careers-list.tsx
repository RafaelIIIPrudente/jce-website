import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { CAREERS, type CareerRole } from "@/lib/content/website";

// S7 Careers — role rows with dept/loc/type + Apply (web-pages-b.jsx:373-409).
// Application mechanism unconfirmed (OPEN-Q #11) — Apply routes to Contact for
// now. Tag: Glass row.

export function WebCareersList({
  roles = CAREERS,
}: {
  roles?: readonly CareerRole[];
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        {roles.map((c, i) => (
          <Reveal key={c.title} delay={Math.min(i * 0.05, 0.2)}>
            <div className="glass flex flex-col gap-3 rounded-(--r-glass) p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-ui-16 font-semibold text-jce-ink">
                  {c.title}
                </div>
                <div className="mt-1 text-ui-13 text-jce-ink-2">
                  {c.dept} · {c.loc} · {c.type}
                </div>
              </div>
              <Button asChild className="h-11 shrink-0 px-5">
                <Link href="/contact-us">Apply</Link>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-5 text-center text-ui-12 text-jce-ink-2">
        Application mechanism (email vs form vs ATS) is pending confirmation —
        OPEN-Q&nbsp;#11.
      </p>
    </>
  );
}
