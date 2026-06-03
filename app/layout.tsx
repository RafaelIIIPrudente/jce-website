import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

// UI family — Inter (handoff source of truth, OPEN-Q #1; pending the official
// JCE brand typeface). Drives --font-sans across website + dashboard.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Document numbers, money and tabular numerals.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Retained only as an optional website display flourish; the dashboard is Inter-only.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jcepower.com"),
  title: {
    default: "JC Electrofields Power System",
    template: "%s — JC Electrofields",
  },
  description:
    "Electrical power systems EPC — Philippines, since 1997. Substation, transmission, and renewable-energy projects for utilities, NGCP, and industrial clients.",
  openGraph: {
    type: "website",
    siteName: "JC Electrofields Power System",
    locale: "en_PH",
    description:
      "Electrical power systems EPC — Philippines, since 1997. Substation, transmission, and renewable-energy projects for utilities, NGCP, and industrial clients.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
