---
name: shadcn-and-tailwind-v4
description: Use when adding or modifying styles, theming, design tokens, or shadcn primitives. Covers Tailwind v4's CSS-first @theme config, the Radix Nova preset, the cn() helper, and the project's design-token vocabulary.
---

# shadcn/ui and Tailwind v4

When this skill applies: any styling change, any new shadcn primitive, any token/color tweak, any decision about class composition.

## CSS-first configuration

This repo uses Tailwind v4. There is **no `tailwind.config.ts`** at the root — configuration lives in `app/globals.css` under the `@theme inline` block (`app/globals.css:7-49`). Token additions go there, not in JavaScript.

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --radius-lg: var(--radius);
  /* ... */
}
```

CSS custom properties (`--background`, `--foreground`, etc.) are defined in `:root` (light) and `.dark` (dark) blocks at `app/globals.css:51-118`. They use `oklch()` color values.

## shadcn Nova preset

`components.json:1-26` configures the project:

- `"style": "radix-nova"` — Nova preset (newer than the default `new-york`).
- `"baseColor": "neutral"`.
- `"cssVariables": true` — themed via CSS custom properties.
- `"iconLibrary": "lucide"` — Lucide is the only icon set (rule 8).
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`.

When you run `pnpm dlx shadcn@latest add <component>`, the CLI uses this config to generate compatible code. Always diff before accepting overwrites — primitives in `components/ui/` are owned source and may have been customized.

## The cn() helper — rule 7

`lib/utils.ts:4-6` exports `cn()`, which composes `clsx` (conditional classes) and `tailwind-merge` (resolves conflicting Tailwind utilities). Every conditional class composition must go through `cn()`:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("rounded-lg p-4", isActive && "bg-muted", className)} />;
```

Never concatenate class strings with `+` or template literals. `tailwind-merge` is required to resolve conflicts like `p-2 p-4` → `p-4`.

## Design-token vocabulary

Use semantic tokens, not raw colors:

| Use case             | Token                                     |
| -------------------- | ----------------------------------------- |
| Surface (page, card) | `bg-background`, `bg-card`                |
| Primary text         | `text-foreground`, `text-card-foreground` |
| Secondary text       | `text-muted-foreground`                   |
| Borders              | `border-border`                           |
| Primary CTA          | `bg-primary text-primary-foreground`      |
| Subtle surface       | `bg-muted`                                |
| Destructive          | `bg-destructive`, `text-destructive`      |
| Focus ring           | `ring-ring`, `border-ring`                |

Raw color utilities (`bg-blue-500`, `text-zinc-700`) belong only in one-off marketing flourishes where no semantic token applies. Prefer adding a new token to `@theme` first.

## Radius scale

`app/globals.css:42-48` defines a custom radius scale:

```
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
```

Use `rounded-md`, `rounded-lg`, etc. — they resolve to these values.

## Common mistakes

- Concatenating class strings without `cn()` (rule 7).
- Adding `tailwind.config.ts` — Tailwind v4 config lives in CSS.
- Using raw color utilities (`bg-zinc-900`) instead of design tokens (`bg-foreground`).
- Re-running `shadcn add` over a customized primitive without diffing.
- Default-importing Lucide (`import Lucide from "lucide-react"`) — rule 8 requires named imports.

## References

- `app/globals.css` — theme config and CSS variables.
- `components.json` — shadcn config.
- `lib/utils.ts:4-6` — `cn()` helper.
- `components/ui/` — owned shadcn primitives.
- BASEPLATE.md § 2 "Tailwind CSS", § 2 "shadcn/ui", § 3 "className / utility helpers".
- AGENTS.md § Architectural rules — rules 7, 8.
