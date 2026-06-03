import {
  BarChart3Icon,
  CalculatorIcon,
  FolderKanbanIcon,
  HomeIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UserIcon,
  UsersIcon,
  WarehouseIcon,
  WrenchIcon,
} from "lucide-react";

// Resolves a MODULES icon id (lib/rbac.ts) to a lucide component. lucide named
// imports only (rule 8); the prototype's inline SVG paths (shell.jsx:7-24) map to
// the nearest lucide equivalents.

const ICON_MAP = {
  home: HomeIcon,
  hr: UsersIcon,
  acc: CalculatorIcon,
  pmg: FolderKanbanIcon,
  pur: ShoppingCartIcon,
  wh: WarehouseIcon,
  bdd: BarChart3Icon,
  eng: WrenchIcon,
  self: UserIcon,
  cfg: SettingsIcon,
} satisfies Record<string, typeof HomeIcon>;

export function ModuleIcon({
  icon,
  className,
  strokeWidth = 1.75,
}: {
  icon: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] ?? HomeIcon;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
