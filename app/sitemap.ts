import type { MetadataRoute } from "next";

const BASE_URL = "https://jcepower.com";

const ROUTES = [
  "/",
  "/about-us",
  "/product-services",
  "/professional-services",
  "/projects",
  "/projects/solar-farm",
  "/projects/distribution-utility",
  "/projects/ngcp",
  "/contact-us",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));
}
