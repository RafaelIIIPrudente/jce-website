import type { Metadata } from "next";

import { SubmitChooser } from "./submit-chooser";

export const metadata: Metadata = { title: "Submit a request" };

// H13 · Submit chooser.
export default function SubmitPage() {
  return <SubmitChooser />;
}
