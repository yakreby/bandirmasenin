import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import TraceForm from "@/components/TraceForm";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "İz bırak",
  description:
    "Bandırma'da gördüğün çöpü fotoğrafla, konumunu işaretle, anonim gönder. Onaydan sonra haritada görünür ve Pazar planına girer.",
  alternates: { canonical: "/iz-birak" },
  openGraph: {
    title: "İz bırak",
    description: "Gördüğün çöpü fotoğrafla ve konumla bildir. İsim yok, hesap yok.",
    url: "/iz-birak",
    type: "website",
  },
};

export default function TracePage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "İz bırak" }]} />
      <div className="contact">
        <section>
          <h1>İz bırak.</h1>
          <p className="hero__lead">
            Yürürken gördüğün çöp yığınını fotoğrafla, konumun o an alınır. İsim yok, hesap yok. Gönüllü
            ekip baktıktan sonra haritaya düşer, bir sonraki Pazar planına girer.
          </p>
          <TraceForm center={SITE.city.center} />
        </section>
        <aside className="contact__aside">
          <div className="box">
            <h3>Nasıl işler</h3>
            <p>
              Fotoğraf ve konum anonim gelir, önce bir gönüllü bakar. Uygunsa haritada turuncu bir iz olur;
              temizlik yapılınca o iz bir çalışma kaydına dönüşür.
            </p>
          </div>
          <div className="box">
            <h3>Güvenlik</h3>
            <p>
              Tehlikeli ya da tıbbi atığa dokunmayın; &ldquo;Tehlikeli atık&rdquo; seçin, belediyeye de
              iletiriz. Yol kenarında fotoğraf çekerken trafiğe dikkat.
            </p>
          </div>
          <div className="box">
            <h3>Gizlilik</h3>
            <p>
              Fotoğraf tarayıcınızda küçültülür, cihaz bilgileri ve gömülü konum atılır. Yalnız fotoğraf,
              işaretlediğiniz konum ve kötüye kullanıma karşı IP saklanır; ad ya da e-posta istenmez.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
