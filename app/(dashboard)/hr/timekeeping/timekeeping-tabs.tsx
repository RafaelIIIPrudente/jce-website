"use client";

import { useState } from "react";

import { Segmented } from "@/components/jce/segmented";
import { SiteDaySheet } from "./site-day/site-day-sheet";
import { TimekeepingGrid } from "./timekeeping-grid";

// H5 timekeeping tabs: "By site" (the H5b Site Day Sheet — DEFAULT) and "By
// employee" (the original H5 weekly grid). Both read/write the SAME timeRowStore
// via the shared accessors, so an edit on one is visible on the other (and in H6)
// when you switch back. Conditional render so switching remounts + re-reads.
export function TimekeepingTabs() {
  const [tab, setTab] = useState<"site" | "emp">("site");

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-5">
      <div className="-mx-1 overflow-x-auto px-1">
        <Segmented
          aria-label="Timekeeping view"
          options={[
            { value: "site", label: "By site" },
            { value: "emp", label: "By employee" },
          ]}
          value={tab}
          onValueChange={(v) => setTab(v === "emp" ? "emp" : "site")}
        />
      </div>
      {tab === "site" ? <SiteDaySheet /> : <TimekeepingGrid />}
    </div>
  );
}
