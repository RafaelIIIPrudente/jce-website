import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Minimal Vitest wiring (first unit test — lib pure logic). Node env: the lib/
// mock modules are pure data/functions (no DOM). The `@/` alias mirrors the
// tsconfig path so `@/lib/...` resolves under test. See lib/mock/hr.test.ts.
const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": root,
    },
  },
});
