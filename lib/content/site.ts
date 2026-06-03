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
    facebook: "https://web.facebook.com/JCElectrofields",
    youtube: "https://youtube.com/@jcepower",
  },
} as const;

// Public website IA (S1–S9). Part 1 reconciled the plan §10 divergences:
//   • /product-services SPLIT into /services (S3) and /products (S5)
//   • /professional-services folded into Services (Engineering Consultancy row) — PROPOSED
//   • added /news (S6), /careers (S7), /faq (S9)
// Contact is the nav CTA (not a link); FAQ lives in the footer.
export const NAV_LINKS = [
  { href: "/about-us", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
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
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

// Footer-only links (not in the primary nav).
export const FOOTER_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact-us", label: "Contact" },
] as const;
