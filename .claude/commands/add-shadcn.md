# /add-shadcn

Install a shadcn/ui primitive into `components/ui/`. Use when a Radix-based UI primitive is needed and not yet in the repo.

## Steps

1. Confirm the primitive is not already installed:

   ```bash
   ls components/ui/
   ```

   Currently installed: `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `form.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `sonner.tsx`, `table.tsx`, `tabs.tsx`.

2. Add the component:

   ```bash
   pnpm dlx shadcn@latest add <component>
   ```

   The CLI uses `components.json:1-26` — Radix Nova preset, neutral base, `cssVariables: true`, Lucide icons, aliases targeting `@/components/ui`.

3. **If the file already exists**, the CLI overwrites it. Diff before accepting:

   ```bash
   git diff components/ui/<component>.tsx
   ```

   shadcn primitives are owned source — discard changes that wipe customizations.

4. Verify the generated file matches project conventions: `cn()` from `@/lib/utils` (rule 7), named Lucide imports (rule 8).

## Verification

- `pnpm lint` passes.
- Import the primitive into a page and confirm it renders in `pnpm dev`.

See [`shadcn-and-tailwind-v4`](../skills/shadcn-and-tailwind-v4/SKILL.md) for the design-token vocabulary and theming model.
