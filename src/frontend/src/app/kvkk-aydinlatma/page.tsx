import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "KVKK aydınlatma metni",
  description:
    "İletişim formu ve gönüllü kayıtlarında hangi kişisel veriler, hangi amaçla, ne kadar süre tutulur; haklarınız nelerdir.",
  alternates: { canonical: "/kvkk-aydinlatma" },
  openGraph: {
    title: "KVKK aydınlatma metni",
    description: "Kişisel verileriniz yalnızca size dönüş yapmak ve çalışmaları düzenlemek için.",
    url: "/kvkk-aydinlatma",
    type: "website",
  },
};

export default function KvkkPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "KVKK aydınlatma metni" }]} />
      <article className="prose">
        <h1>Kişisel verileriniz</h1>
        <p className="lead">
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, iletişim formu ve gönüllü
          kayıtlarında topladığımız verileri ne için kullandığımızı burada açıklıyoruz.
        </p>

        <h2>Veri sorumlusu</h2>
        <p>
          Bandırma Senin girişimi adına siteyi işleten Liman Yazılım. Başvuru adresi:{" "}
          {SITE.contactEmail}.
        </p>

        <h2>Hangi veriler, hangi amaçla</h2>
        <ul>
          <li>Ad, e-posta ve isteğe bağlı telefon: size dönüş yapmak, Pazar çalışmalarının yer ve saatini bildirmek.</li>
          <li>Mesaj içeriği ve nokta önerisindeki konum: çalışmayı planlamak, noktayı değerlendirmek.</li>
          <li>Gönderdiğiniz fotoğraflar: nokta kaydını belgelemek. Yayın öncesi elden geçirilir; kişilerin yüzü görünen fotoğraflar yayınlanmaz.</li>
          <li>IP adresi: kötüye kullanımı (toplu gönderim) engellemek için, mesajla birlikte tutulur.</li>
        </ul>

        <h2>Hukuki dayanak</h2>
        <p>
          Form gönderirken verdiğiniz açık rıza ve sizinle kurulacak iletişimin gerektirdiği meşru
          menfaat (KVKK m. 5/1 ve 5/2-f).
        </p>

        <h2>Kimlerle paylaşılır</h2>
        <p>
          Hiçbir üçüncü tarafla paylaşılmaz, satılmaz. Veriler Türkiye&apos;de barındırılan
          sunucumuzda tutulur. Belediyeye yalnızca noktanın konumu ve fotoğrafı iletilir, kişisel
          bilginiz iletilmez.
        </p>

        <h2>Ne kadar süre</h2>
        <p>
          Mesajlar ve iletişim bilgileri son yazışmadan itibaren en fazla 12 ay. Gönüllü listesinde
          kalmak istemezseniz yazmanız yeterli, aynı gün silinir.
        </p>

        <h2>Haklarınız</h2>
        <p>
          KVKK m. 11 uyarınca verilerinize erişme, düzeltilmesini ya da silinmesini isteme, işlemeye
          itiraz etme hakkınız var. {SITE.contactEmail} adresine yazın; en geç 30 gün içinde dönüş
          yaparız.
        </p>

        <h2>Çerezler</h2>
        <p>
          Sitedeki çerezler ve analitik için ayrı bir sayfa var: çerez politikası. Analitik yalnızca
          siz kabul ederseniz yüklenir.
        </p>
      </article>
    </main>
  );
}
