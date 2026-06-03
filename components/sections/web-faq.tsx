"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { FAQS, type Faq } from "@/lib/content/website";

// S9 FAQ — accordion, first item open (web-pages-b.jsx:415-444). The page also
// emits FAQPage JSON-LD for SEO/GEO. Tag: Solid.

export function WebFaq({ items = FAQS }: { items?: readonly Faq[] }) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="solid overflow-hidden rounded-[var(--r-solid)]"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
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
                  id={`faq-panel-${i}`}
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
  );
}
