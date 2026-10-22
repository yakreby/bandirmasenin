import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

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
          <Link href="/iletisim?konu=katilim" title="Katılım formunu aç">
            Formu doldurun
          </Link>
          , listeye ekleyelim. Yalnız gelmek de, mahalleden üç kişi getirmek de olur.
        </p>
        <p>
          <Link href="/iletisim?konu=katilim" className="btn btn--primary" title="Katılım formunu aç">
            Katılmak istiyorum
          </Link>
        </p>

        <h2>Ne getirmeli</h2>
        <ul>
          <li>Kapalı ayakkabı ve rahat kıyafet.</li>
          <li>Su ve şapka. Yazın sahil gölgesizdir.</li>
          <li>Eldiven, çöp maşası ve çuval: her çalışma için ne gerektiği ve kimin getireceği davette yazar. Koruyucu ekipman yoksa çalışma yapılmaz.</li>
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
          Yürürken gördüğünüz bir yeri{" "}
          <Link href="/iletisim?konu=nokta" title="Nokta önerme formunu aç">
            bize yazın
          </Link>
          : konum (haritadan paylaşım yeterli), bir fotoğraf ve kısa bir not. Yetki durumu ve
          güvenlik uygunsa haritaya &ldquo;tespit edildi&rdquo; olarak gireriz.
        </p>
      </article>
    </main>
  );
}
