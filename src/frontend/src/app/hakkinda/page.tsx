import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "Bandırma Senin nedir, neden ölçüyoruz, 30 gün kuralı ve destekçi olmanın yolu.",
  alternates: { canonical: "/hakkinda" },
  openGraph: {
    title: "Bandırma Senin hakkında",
    description: "Temizliyoruz, tartıyoruz, bir ay sonra geri dönüp bakıyoruz.",
    url: "/hakkinda",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Hakkında" }]} />
      <article className="prose">
        <h1>Temizlemek kolay. Temiz kalmasını takip etmek iş.</h1>
        <p className="lead">
          Bandırma Senin, şehirdeki kirli noktaları haritaya işleyen, temizleyen, atığı tartıp
          teslim eden ve bir ay sonra aynı yere geri dönüp bakan bağımsız bir yerel girişim.
        </p>

        <h2>Neden harita</h2>
        <p>
          Bir sahili temizlemek güzel; ama orası bir ay sonra yine çöplükse sorun atık değil,
          atığın oraya nasıl geldiğidir. Her noktayı koordinatıyla tutmak, önce ve sonra
          fotoğrafını aynı açıdan çekmek ve 30 gün sonra tekrar bakmak bu soruya cevap verir.
          Biriken kayıt belediyeye &ldquo;şuraya çöp kutusu, şuraya levha&rdquo; diyebilmenin
          dayanağı olur.
        </p>

        <h2>İlkeler</h2>
        <ul>
          <li>Atık kantarla tartılır. Göz kararı tahmin ayrı işaretlenir, kesin sayı gibi gösterilmez.</li>
          <li>Önce ve sonra fotoğrafı aynı açıdan çekilir. Yakınlaştırmayla kandırmaca yok.</li>
          <li>Atığın nereye teslim edildiği her kayıtta yazar.</li>
          <li>Her temizlikten 30 gün sonra kontrol edilir ve sonucu kayda girer, iyi ya da kötü.</li>
          <li>Platform hiçbir kurumun reklam alanı değildir. Destekçiler katkı verdikleri noktada görünür.</li>
          <li>Örnek kayıtlar &ldquo;örnek kayıt&rdquo; damgası taşır ve toplamlara girmez.</li>
        </ul>

        <h2>Bir çalışma nasıl ilerler</h2>
        <p>
          Tespit: nokta haritaya girer, yetki durumu belediyeyle netleşir. Temizlik: Pazar sabahı,
          ayrıştırarak, tartarak. İyileştirme: gerekiyorsa yetkili kurum onayıyla levha, toplama
          noktası ya da küçük düzenleme. Kontrol: 30 gün sonra aynı açıdan fotoğraf.
        </p>

        <h2>Destekçi olmak</h2>
        <p>
          Ekipman, ayrıştırılmış atığın kabulü, geri kazanılmış malzemeden levha ve toplama
          ünitesi ya da doğrudan bütçe. Her katkı haritada, katkı verdiği noktada görünür.{" "}
          <Link href="/iletisim?konu=destek" title="Destekçi olmak için formu aç">
            Bize yazın
          </Link>
          .
        </p>

        <h2>Kim yapıyor</h2>
        <p>
          Bandırma&apos;da yaşayan, hafta içi yazılım geliştiren, Pazar günü dışarı çıkıp o
          yazılımı kullanan birkaç kişi. Platformu Liman Yazılım geliştiriyor; marka ve veri
          Bandırma Senin&apos;in.
        </p>
      </article>
    </main>
  );
}
