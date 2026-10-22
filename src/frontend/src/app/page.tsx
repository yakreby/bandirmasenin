import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { fetchSpotsResult, fetchSponsors } from "@/lib/data";
import { siteStats, SITE } from "@/lib/content";
import { formatKg } from "@/lib/status";
import MapLoader from "@/components/MapLoader";
import SpotCard from "@/components/SpotCard";
import Reveal from "@/components/Reveal";

const CITY_PHOTOS = [
  { src: "/photos/city/shore-sunset.jpg", alt: "Bandırma kayalık kıyısında gün batımı", caption: "Kayalık kıyı, gün batımı" },
  { src: "/photos/city/son-kursun.jpg", alt: "Son Kurşun Anıtı ve Marmara Denizi", caption: "Son Kurşun Anıtı" },
  { src: "/photos/city/camlik.jpg", alt: "Çamlık'ta çam ağaçları arasında yürüyüş yolu", caption: "Çamlık" },
  { src: "/photos/city/bridge-sunset.jpg", alt: "Gün batımında köprü ve balıkçı tekneleri", caption: "Köprü, akşam" },
];

export default async function HomePage() {
  const [result, sponsors] = await Promise.all([fetchSpotsResult(), fetchSponsors()]);
  const spots = result.data;
  const stats = siteStats(spots);
  const outage = result.error;

  return (
    <main>
      <section className="hero">
        <Image
          src="/photos/city/bridge-lighthouse.jpg"
          alt="Bandırma sahili: köprü, fener ve sahil parkı"
          fill
          priority
          sizes="100vw"
          className="hero__img"
        />
        <div className="hero__shade" aria-hidden />
        <div className="wrap hero__in">
          <div className="hero__place">
            <MapPin size={16} aria-hidden />
            Bandırma
          </div>
          <h1>Bu şehir hepimizin.</h1>
          <p className="hero__lead">
            Bir noktadan başlıyoruz. Temizliyoruz, tartıyoruz, bir ay sonra geri dönüp aynı açıdan
            bakıyoruz. Her çalışma haritada, fotoğraflı ve kiloyla.
          </p>
          <div className="hero__cta">
            <Link href="/katil" className="btn btn--lime" title="Pazar temizliğine katıl">
              Pazar günü bize katıl
            </Link>
            <Link href="/#harita" className="btn btn--light" title="Çalışma haritasına git">
              Haritaya bak
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap totals" aria-label="Toplamlar">
        <div className={`stats${stats.demoOnly || outage ? " stats--empty" : ""}`}>
          <div className="stat">
            <span className="stat__n">{outage ? "–" : stats.spots}</span>
            <span className="stat__l">nokta temizlendi</span>
          </div>
          <div className="stat">
            <span className="stat__n">{outage ? "–" : formatKg(stats.kg)}</span>
            <span className="stat__l">kg atık tartıldı</span>
          </div>
          <div className="stat">
            <span className="stat__n">{outage ? "–" : stats.volunteers}</span>
            <span className="stat__l">gönüllü katıldı</span>
          </div>
          <div className="stat">
            <span className="stat__n">{outage ? "–" : stats.rechecked}</span>
            <span className="stat__l">nokta yeniden kontrol edildi</span>
          </div>
        </div>
        {outage ? (
          <p className="note note--err" role="status">
            Çalışma verileri şu anda alınamıyor. Harita ve kayıtlar bağlantı gelince görünür; bu
            sırada örnek veri gösterilmez.
          </p>
        ) : stats.demoOnly ? (
          <p className="note">
            Henüz gerçek bir çalışma kaydı yok. Haritadaki noktalar arayüzü göstermek için hazırlanmış
            örnek kayıtlardır ve toplamlara girmez.
          </p>
        ) : (
          <p className="note">
            Toplamlar yalnızca kantarla tartılmış ve teslim edilmiş atığı kapsar
            {stats.kgEstimated > 0.05 && <>; göz kararı tahmin edilen {formatKg(stats.kgEstimated)} kg ayrı tutulur</>}.
          </p>
        )}
      </section>

      <section className="wrap sec" id="harita">
        <div className="sec__head">
          <h2>Harita</h2>
          <p>{outage ? "Bağlantı gelince noktalar görünür." : "Bir noktaya dokun, kaydını aç."}</p>
        </div>
        <MapLoader spots={spots} center={SITE.city.center} zoom={SITE.city.zoom} />
      </section>

      <Reveal as="section" className="wrap sec" id="calismalar">
        <div className="sec__head">
          <h2>Çalışmalar</h2>
          <p>En son çalışma en üstte.</p>
        </div>
        {outage ? (
          <div className="empty">Kayıtlar şu anda alınamıyor. Birazdan tekrar deneyin.</div>
        ) : spots.length === 0 ? (
          <div className="empty">Henüz kayıt yok. İlk nokta bu Pazar.</div>
        ) : (
          <div className="spots">
            {spots.map((s) => (
              <SpotCard key={s.slug} spot={s} />
            ))}
          </div>
        )}
      </Reveal>

      <Reveal as="section" className="wrap sec" id="nasil">
        <div className="sec__head">
          <h2>Bir nokta nasıl ilerler</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step__n">1</div>
            <h3>Tespit</h3>
            <p>
              Nokta haritaya işlenir, aynı açıdan tekrar çekilebilecek bir &ldquo;önce&rdquo;
              fotoğrafı alınır. Yetki durumu belediyeyle netleştirilir.
            </p>
          </div>
          <div className="step">
            <div className="step__n">2</div>
            <h3>Temizlik</h3>
            <p>
              Pazar sabahı, eldiven ve maşayla. Atık türüne göre ayrıştırılır, kantarda tartılır,
              yetkili kuruma teslim edilir. Teslim yeri kayda yazılır.
            </p>
          </div>
          <div className="step">
            <div className="step__n">3</div>
            <h3>30 gün sonra kontrol</h3>
            <p>
              Aynı açıdan yeni fotoğraf. Nokta yeniden kirlendiyse nedeni araştırılır ve kalıcı
              çözüm önerisi belediyeye iletilir.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap sec" id="bandirma">
        <div className="sec__head">
          <h2>Neyi koruduğumuz</h2>
          <p>Bandırma, kıyısıyla ve yeşiliyle.</p>
        </div>
        <div className="strip">
          {CITY_PHOTOS.map((p) => (
            <figure key={p.src}>
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 900px) 50vw, 100vw" />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="wrap sec" id="destek">
        <div className="sec__head">
          <h2>Destekçiler</h2>
          <p>Her katkı, katkı verdiği noktada görünür.</p>
        </div>
        {sponsors.length === 0 ? (
          <div className="empty">
            Bu alan ilk destekçiyi bekliyor. Ekipman, atık kabulü ya da bütçe ile katkı vermek
            isterseniz{" "}
            <Link href="/iletisim?konu=destek" title="Destekçi olmak için formu aç">
              bize yazın
            </Link>
            .
          </div>
        ) : (
          <div className="sponsors">
            {sponsors.map((sp) => (
              <div className="sponsor" key={sp.id}>
                <h3>
                  {sp.url ? (
                    <a href={sp.url} title={sp.name} target="_blank" rel="noopener noreferrer">
                      {sp.name}
                    </a>
                  ) : (
                    sp.name
                  )}
                </h3>
                {sp.contribution && <p>{sp.contribution}</p>}
              </div>
            ))}
          </div>
        )}
      </Reveal>

      <section className="band">
        <div className="wrap band__in">
          <div>
            <h2>Pazar sabahı bir nokta, iki saat.</h2>
            <p>Yer, saat ve ekipman davette yazar. Öğlene kalmadan bitiyor.</p>
          </div>
          <Link href="/katil" className="btn btn--lime" title="Pazar temizliğine katıl">
            Katılmak istiyorum
          </Link>
        </div>
      </section>
    </main>
  );
}
