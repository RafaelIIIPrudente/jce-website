import type { MetadataRoute } from "next";

const BASE_URL = "https://jcepower.com";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    rules: [
      {
        userAgent: "*",
        ...(isProduction ? { allow: "/" } : { disallow: "/" }),
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
