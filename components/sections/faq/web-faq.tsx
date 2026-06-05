"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { VoltageTag } from "@/components/sections/kit/web-voltage-tag";
import { FAQS, type Faq } from "@/lib/content/website";

// S9 FAQ — accordion, first item open (web-pages-b.jsx:415-444). The page also
// emits FAQPage JSON-LD for SEO/GEO. Items group by `category` into electrified
// sub-sections (VoltageTag sub-heads); the open-state key is the STABLE question
// text, so grouped items never collide across categories. Premium circuit-card
// solid surfaces with a left current-rule that energizes amber on the open item.
// Behavior, a11y wiring and motion are unchanged from the flat version.

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Group = { category: string; items: Faq[] };

function groupByCategory(items: readonly Faq[]): Group[] {
  const groups: Group[] = [];
  for (const f of items) {
    const category = f.category ?? "";
    const g = groups.find((x) => x.category === category);
    if (g) g.items.push(f);
    else groups.push({ category, items: [f] });
  }
  return groups;
}

export function WebFaq({ items = FAQS }: { items?: readonly Faq[] }) {
  // Open state keyed by the stable question text (not a flat index) so grouped
  // items in different categories never collide. First item open by default.
  const [open, setOpen] = useState<string>(items[0]?.q ?? "");
  const reduce = useReducedMotion();

  const groups = groupByCategory(items);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      {groups.map((group) => (
        <div key={group.category || "_"} className="flex flex-col gap-3">
          {group.category ? (
            <VoltageTag className="self-start">{group.category}</VoltageTag>
          ) : null}
          {group.items.map((f) => {
            const isOpen = open === f.q;
            const panelId = `faq-panel-${slug(f.q)}`;
            return (
              <div
                key={f.q}
                className={cn(
                  "circuit-card solid overflow-hidden rounded-(--r-solid) border-l-2 transition-colors",
                  isOpen ? "border-l-jce-cyan-deep" : "border-l-jce-line",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? "" : f.q)}
                  className="focus-ring-jce flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-ui-16 font-semibold text-jce-ink">
                    {f.q}
                  </span>
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full transition-colors",
                      isOpen
                        ? "bg-jce-green-700 text-white"
                        : "bg-jce-green-50 text-jce-green-700",
                    )}
                  >
                    {isOpen ? (
                      <MinusIcon className="size-4" aria-hidden />
                    ) : (
                      <PlusIcon className="size-4" aria-hidden />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <p className="px-5 pb-5 text-ui-14 text-pretty text-jce-ink-2">
                        {f.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
