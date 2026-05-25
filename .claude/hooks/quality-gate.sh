#!/usr/bin/env bash
# Claude Code Stop-event hook. Blocks the response if any architectural rule
# from AGENTS.md § Architectural rules is violated, or if `pnpm lint` fails.

set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$ROOT" || exit 1

FAIL=0

# Rule 2 — process.env outside env.ts / next.config.ts.
if grep -RIn --include='*.ts' --include='*.tsx' \
    --exclude='env.ts' --exclude='next.config.ts' \
    'process\.env' app lib components 2>/dev/null; then
  echo "[quality-gate] process.env used outside env.ts / next.config.ts (rule 2)." >&2
  FAIL=1
fi

# Rule 9 — framer-motion import.
if grep -RIn --include='*.ts' --include='*.tsx' \
    "from ['\"]framer-motion['\"]" app lib components 2>/dev/null; then
  echo "[quality-gate] framer-motion import found (rule 9 — use motion/react)." >&2
  FAIL=1
fi

# Rule 3 — getSession() in app/ or lib/.
if grep -RIn --include='*.ts' --include='*.tsx' \
    'getSession(' app lib 2>/dev/null; then
  echo "[quality-gate] getSession() found (rule 3 — use getUser() instead)." >&2
  FAIL=1
fi

# pnpm lint.
if ! pnpm lint >/dev/null 2>&1; then
  echo "[quality-gate] pnpm lint failed." >&2
  FAIL=1
fi

exit "$FAIL"
