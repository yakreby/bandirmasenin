import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Pazar temizliğine katılmak, kirli bir nokta önermek ya da destekçi olmak için bize yazın.",
  alternates: { canonical: "/iletisim" },
  openGraph: {
    title: "Bize yazın",
    description: "Katılım, nokta önerisi ve destek için iletişim formu.",
    url: "/iletisim",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "İletişim" }]} />
      <div className="contact">
        <section>
          <h1>Bize yazın.</h1>
          <p className="hero__lead">
            Katılmak, bir nokta önermek ya da destekçi olmak için. Birkaç gün içinde e-postayla dönüş
            yaparız.
          </p>
          <Suspense fallback={null}>
            <ContactForm email={SITE.contactEmail} />
          </Suspense>
        </section>
        <aside className="contact__aside">
          <div className="box">
            <h3>E-posta</h3>
            <p>{SITE.contactEmail}</p>
          </div>
          <div className="box">
            <h3>Pazar çalışmaları</h3>
            <p>
              Yer ve saat her hafta katılımcılara e-postayla gider. Eldiven, maşa ve çuval bizden;
              kapalı ayakkabı ve su sizden.
            </p>
          </div>
          <div className="box">
            <h3>Nokta önerirken</h3>
            <p>
              Konumu ve ne gördüğünüzü yazın; fotoğrafınız varsa dönüş e-postasına ekleyebilirsiniz.
              Tehlikeli atık görürseniz dokunmayın, bize ve belediyeye bildirin.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
