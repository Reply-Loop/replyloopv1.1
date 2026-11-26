import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/ui/CTABand";
import { graph, organizationSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";
import { MOTION_HEAD_SCRIPT } from "@/lib/motion/state";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted at build time by next/font. No request to Google at runtime.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ReplyLoop | Google review replies for local health businesses",
    template: "%s | ReplyLoop",
  },
  description: site.description,
  applicationName: site.name,
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#F8F5EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-US"
      data-motion="full"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} antialiased`}
    >
      <head>
        {/* Sets html[data-motion] before first paint: see src/lib/motion/state.ts. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_HEAD_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-charcoal px-5 py-3 font-semibold text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <CTABand />
        <Footer />
        <MobileBar />
        <Analytics />
        <JsonLd data={graph(organizationSchema(), websiteSchema(), professionalServiceSchema())} />
      </body>
    </html>
  );
}
