import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

// Self-hosted by next/font. Only the Latin subsets ship (the site renders no
// other script), the same files next/font/google produced: Fraunces with its
// opsz and wght axes, Inter with wght. SIL OFL, see assets/fonts/*-OFL.txt.
// The SOFT axis was measured and dropped: +53,484 B against a 20 KB gate.
const fraunces = localFont({
  src: "./fonts/fraunces-latin-opsz-wght.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const inter = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
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
      data-motion="static"
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
