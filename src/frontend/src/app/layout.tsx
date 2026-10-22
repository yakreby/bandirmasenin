import type { Metadata, Viewport } from "next";
import { Gabarito, Public_Sans } from "next/font/google";
import { SITE } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";
import BottomNav from "@/components/BottomNav";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import "./globals.css";
import "./ui-members.css";

/* next/font yazı tiplerini derleme anında indirir ve siteden servis eder; tarayıcı Google'a istek atmaz. */
const display = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const body = Public_Sans({
  variable: "--font-public",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const BASE = "https://bandirmasenin.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Bandırma'da çevre temizliği ve kamusal alan iyileştirme çalışmalarının koordinatlı, önce/sonra fotoğraflı ve tartılı kaydı.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE.name,
    locale: "tr_TR",
    type: "website",
    url: "/",
    title: `${SITE.name}: ${SITE.tagline}`,
    description:
      "Temizliyoruz, tartıyoruz, bir ay sonra geri dönüp aynı açıdan bakıyoruz. Her çalışma haritada.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1e6b74",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const dev = process.env.NODE_ENV === "development";
  return (
    <html
      lang="tr"
      className={`${display.variable} ${body.variable}${dev ? " force-motion" : ""}`}
    >
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${BASE}/#org`,
                name: SITE.name,
                url: BASE,
                email: SITE.contactEmail,
                areaServed: { "@type": "City", name: SITE.city.name },
              },
              {
                "@type": "WebSite",
                "@id": `${BASE}/#site`,
                name: SITE.name,
                url: BASE,
                inLanguage: "tr",
                publisher: { "@id": `${BASE}/#org` },
              },
            ],
          }}
        />
        <SiteHeader name={SITE.name} />
        {children}
        <SiteFooter name={SITE.name} email={SITE.contactEmail} supporter={SITE.supporter} />
        <BottomNav />
        <BackToTop />
        <CookieConsent />
        <Analytics id={SITE.gaId} />
      </body>
    </html>
  );
}
