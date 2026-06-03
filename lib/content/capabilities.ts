import type { LucideIcon } from "lucide-react";
import {
  CableIcon,
  CpuIcon,
  FactoryIcon,
  GaugeIcon,
  RouteIcon,
  SunIcon,
  TowerControlIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";

export type Capability = {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

export const CAPABILITIES: readonly Capability[] = [
  {
    eyebrow: "Substations & transmission",
    title: "Design and build to 138 kV.",
    body: "Front-end design, civil works, equipment supply, testing, and commissioning — turnkey, with a single accountable team.",
    icon: TowerControlIcon,
  },
  {
    eyebrow: "Solar & renewables",
    title: "EPC for utility-scale PV.",
    body: "From 1 MWp pilots to the country's largest urban solar farm at Brgy. Isla, Valenzuela. Supply through commissioning.",
    icon: SunIcon,
  },
  {
    eyebrow: "Industrial electrical",
    title: "Plant systems that stay up.",
    body: "HVSG, MVSG, LVSG fabrication, automation, control wiring, and motor controls for industrial clients.",
    icon: FactoryIcon,
  },
] as const;

export const EXTENDED_CAPABILITIES: readonly Capability[] = [
  ...CAPABILITIES,
  {
    eyebrow: "NGCP direct connection",
    title: "Connect to the national grid at 69 kV.",
    body: "Systems Impact Study coordination, Facility Study reports, and physical connection compliance.",
    icon: CableIcon,
  },
  {
    eyebrow: "Switchgear fabrication",
    title: "HVSG, MVSG, LVSG in-house.",
    body: "Design, fabrication, and assembly of switchgear assemblies to project specification.",
    icon: GaugeIcon,
  },
  {
    eyebrow: "Automation & controls",
    title: "SCADA, PLC, and protection.",
    body: "Control wiring and motor controls for industrial process electrical systems.",
    icon: CpuIcon,
  },
  {
    eyebrow: "Maintenance & servicing",
    title: "Substation and plant uptime.",
    body: "Preventive and corrective maintenance for utilities and industrial plants under service contracts.",
    icon: WrenchIcon,
  },
  {
    eyebrow: "Consulting",
    title: "Independent electrical review.",
    body: "Plant electrical billing, upgrading, and optimization — billing studies through rectification scopes.",
    icon: ZapIcon,
  },
  {
    eyebrow: "Project delivery",
    title: "Single-vendor accountability.",
    body: "One team — engineering through commissioning — for utilities, NGCP, and industrial clients nationwide.",
    icon: RouteIcon,
  },
] as const;
