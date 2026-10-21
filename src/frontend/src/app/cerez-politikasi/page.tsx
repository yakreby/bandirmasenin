import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Çerez politikası",
  description:
    "bandirmasenin.com hangi verileri tarayıcınızda tutar, hangi dış servislere istek gönderir.",
  alternates: { canonical: "/cerez-politikasi" },
  openGraph: {
    title: "Çerez politikası",
    description: "Analitik ya da reklam çerezi yok. Ne var, burada yazıyor.",
    url: "/cerez-politikasi",
    type: "website",
  },
};

export default function CookiePolicyPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Çerez politikası" }]} />
      <article className="prose">
        <h1>Çerez politikası</h1>
        <p className="lead">
          Bu site analitik, reklam ya da takip çerezi kullanmaz. Aşağıda tarayıcınızda tutulan tek
          kayıt ve istek gönderilen tek dış servis açıklanıyor.
        </p>

        <h2>Tarayıcınızda tutulanlar</h2>
        <ul>
          <li>
            Çerez bildirimi tercihiniz (<code>bs-cookie-consent</code>), tarayıcınızın yerel
            depolamasında. Sunucuya gönderilmez, bildirimin tekrar çıkmaması içindir.
          </li>
        </ul>

        <h2>Dış servisler</h2>
        <ul>
          <li>
            Harita karoları OpenStreetMap sunucularından yüklenir. Bu istek sırasında IP adresiniz
            OpenStreetMap Vakfı&apos;na iletilir. Kullanım koşulları:{" "}
            <a href="https://operations.osmfoundation.org/policies/tiles/" title="OpenStreetMap karo kullanım politikası" rel="noopener">
              operations.osmfoundation.org
            </a>
            .
          </li>
          <li>Yazı tipleri bu sitenin kendi sunucusundan servis edilir; üçüncü tarafa istek gitmez.</li>
        </ul>

        <h2>Değişiklik</h2>
        <p>
          İleride analitik eklenirse yalnızca onay verdiğinizde yüklenir ve bu sayfa güncellenir.
          Sorular için <a href={`mailto:${SITE.contactEmail}`} title="E-posta gönder">{SITE.contactEmail}</a>.
        </p>
      </article>
    </main>
  );
}
