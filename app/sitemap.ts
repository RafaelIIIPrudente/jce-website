import type { MetadataRoute } from "next";

const BASE_URL = "https://jcepower.com";

const ROUTES = [
  "/",
  "/about-us",
  "/services",
  "/products",
  "/projects",
  "/projects/solar-farm",
  "/projects/distribution-utility",
  "/projects/ngcp",
  "/news",
  "/careers",
  "/faq",
  "/contact-us",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));
}
