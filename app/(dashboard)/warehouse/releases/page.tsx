import type { Metadata } from "next";

import { ReleaseRegister } from "./release-register";

export const metadata: Metadata = { title: "Releases" };

export default function ReleasesPage() {
  return <ReleaseRegister />;
}
