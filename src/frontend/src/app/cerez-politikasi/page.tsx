import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Çerez politikası",
  description:
    "bandirmasenin.com hangi verileri tarayıcınızda tutar, hangi dış servislere istek gönderir, analitik ne zaman yüklenir.",
  alternates: { canonical: "/cerez-politikasi" },
  openGraph: {
    title: "Çerez politikası",
    description: "Analitik yalnızca onayınızla. Reklam çerezi yok. Ne var, burada yazıyor.",
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
          Bu site reklam ya da takip çerezi kullanmaz. Ziyaret istatistiği için Google Analytics
          kullanır ve bunu yalnızca siz kabul ederseniz yükler.
        </p>

        <h2>Tarayıcınızda tutulanlar</h2>
        <ul>
          <li>
            Çerez bildirimi tercihiniz (<code>bs-cookie-consent</code>), tarayıcınızın yerel
            depolamasında. Sunucuya gönderilmez; bildirimin tekrar çıkmaması ve analitiğin yüklenip
            yüklenmeyeceğini bilmek içindir.
          </li>
          <li>
            &ldquo;Kabul et&rdquo; dediyseniz Google Analytics&apos;in <code>_ga</code> ve{" "}
            <code>_ga_*</code> çerezleri (ziyaretçiyi ayırt etmek için rastgele kimlik, 2 yıl).
            &ldquo;Yalnızca gerekli&rdquo; dediyseniz bu çerezler hiç yazılmaz.
          </li>
        </ul>

        <h2>Dış servisler</h2>
        <ul>
          <li>
            Google Analytics (yalnızca onay sonrası): hangi sayfaların ne kadar görüntülendiğini
            sayar; IP adresi anonimleştirilerek işlenir.{" "}
            <a href="https://policies.google.com/privacy" title="Google gizlilik politikası" rel="noopener">
              Google gizlilik politikası
            </a>
            .
          </li>
          <li>
            Harita karoları OpenStreetMap sunucularından yüklenir. Bu istek sırasında IP adresiniz
            OpenStreetMap Vakfı&apos;na iletilir.{" "}
            <a href="https://operations.osmfoundation.org/policies/tiles/" title="OpenStreetMap karo kullanım politikası" rel="noopener">
              Kullanım koşulları
            </a>
            .
          </li>
          <li>Yazı tipleri bu sitenin kendi sunucusundan servis edilir; üçüncü tarafa istek gitmez.</li>
        </ul>

        <h2>Tercihinizi değiştirmek</h2>
        <p>
          Tarayıcınızın site verilerini temizleyin; bildirim yeniden çıkar ve tekrar seçersiniz.
          Sorular için <a href={`mailto:${SITE.contactEmail}`} title="E-posta gönder">{SITE.contactEmail}</a>.
        </p>
      </article>
    </main>
  );
}
