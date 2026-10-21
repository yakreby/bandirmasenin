import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { SITE } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

/* next/font yazı tiplerini derleme anında indirir ve siteden servis eder; tarayıcı Google'a istek atmaz. */
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
        <SiteFooter name={SITE.name} email={SITE.contactEmail} />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
