export const SITE = {
  brand: "JC Electrofields Power System, Inc.",
  shortBrand: "JC Electrofields",
  tagline: "Electrical power systems EPC — Philippines, since 1997.",
  founded: 1997,
  address: {
    line1: "3074 F. Bautista St.",
    line2: "Ugong, Valenzuela City",
    country: "Philippines",
  },
  email: "sales@jcepower.com",
  phone: "+63 2 8562 8540",
  hours: {
    days: "Monday–Saturday",
    open: "8:00 AM – 5:00 PM",
  },
  social: {
    facebook: "https://facebook.com/jcepower",
    youtube: "https://youtube.com/@jcepower",
  },
} as const;

export const NAV_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/product-services", label: "Product & Services" },
  { href: "/professional-services", label: "Professional Services" },
  {
    href: "/projects",
    label: "Projects",
    children: [
      { href: "/projects/solar-farm", label: "Solar Farm" },
      {
        href: "/projects/distribution-utility",
        label: "Distribution Utility",
      },
      { href: "/projects/ngcp", label: "NGCP" },
    ],
  },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
