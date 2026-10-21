import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Katıl",
  description:
    "Pazar sabahları Bandırma'da bir noktayı birlikte temizliyoruz. Ne getirmeli, güvenlik kuralları ve nokta önerme.",
  alternates: { canonical: "/katil" },
  openGraph: {
    title: "Pazar temizliğine katıl",
    description: "Bir nokta, iki saat. Eldiven ve maşa bizden.",
    url: "/katil",
    type: "website",
  },
};

export default function JoinPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Katıl" }]} />
      <article className="prose">
        <h1>Pazar sabahı bir nokta, iki saat.</h1>
        <p className="lead">
          Büyük organizasyon yok. Bir noktada buluşuyoruz, temizliyoruz, tartıyoruz, teslim
          ediyoruz. Öğlene kalmadan bitiyor.
        </p>

        <h2>Nasıl katılırım</h2>
        <p>
          Bir sonraki çalışmanın yeri ve saati e-postayla paylaşılır.{" "}
          <a href={`mailto:${SITE.contactEmail}?subject=Pazar%20temizli%C4%9Fine%20kat%C4%B1lmak%20istiyorum`} title="Katılım e-postası gönder">
            Yazın
          </a>
          , listeye ekleyelim. Yalnız gelmek de, mahalleden üç kişi getirmek de olur.
        </p>

        <h2>Ne getirmeli</h2>
        <ul>
          <li>Kapalı ayakkabı ve rahat kıyafet.</li>
          <li>Su ve şapka. Yazın sahil gölgesizdir.</li>
          <li>Eldiven, çöp maşası ve çuval bizden.</li>
        </ul>

        <h2>Güvenlik kuralları</h2>
        <p>Burada amatör davranmıyoruz. Bu kurallara uymayan çalışma yapılmaz.</p>
        <ul className="rules">
          <li>Kesici, delici, tıbbi, kimyasal ya da ne olduğu belli olmayan atığa dokunulmaz; fotoğraflanıp belediyeye bildirilir.</li>
          <li>Trafiğe açık yol kenarlarında ve dik, kaygan kıyılarda gönüllü çalışması yapılmaz.</li>
          <li>Eldiven olmadan atık tutulmaz.</li>
          <li>Ayrıştırılmış atık belediyeye ya da yetkili tesise teslim edilir; nereye gittiği kayda yazılır.</li>
          <li>Çekimlerde gönüllülerin rızası alınır, çevredeki kişilerin yüzü paylaşılmaz.</li>
          <li>Hava kötüyse çalışma ertelenir. Fırtına günü kahramanlık yok.</li>
        </ul>

        <h2>Bir nokta önermek</h2>
        <p>
          Yürürken gördüğünüz bir yeri bize yazın: konum (haritadan paylaşım yeterli), bir fotoğraf
          ve kısa bir not. Yetki durumu ve güvenlik uygunsa haritaya &ldquo;tespit edildi&rdquo;
          olarak gireriz.
        </p>
      </article>
    </main>
  );
}
