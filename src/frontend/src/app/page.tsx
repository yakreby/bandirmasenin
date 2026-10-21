import Link from "next/link";
import { fetchSpots, fetchSponsors } from "@/lib/data";
import { siteStats, SITE } from "@/lib/content";
import { formatKg } from "@/lib/status";
import MapLoader from "@/components/MapLoader";
import SpotCard from "@/components/SpotCard";
import Reveal from "@/components/Reveal";

export default async function HomePage() {
  const [spots, sponsors] = await Promise.all([fetchSpots(), fetchSponsors()]);
  const stats = siteStats(spots);

  return (
    <main>
      <section className="wrap hero" id="harita">
        <div>
          <h1>Bu şehir hepimizin.</h1>
          <p className="hero__lead">
            Bandırma&apos;da bir noktadan başlıyoruz. Temizliyoruz, tartıyoruz, bir ay sonra geri
            dönüp aynı açıdan bakıyoruz. Her çalışma bu haritada.
          </p>

          <div className={`stats${stats.demoOnly ? " stats--empty" : ""}`} aria-label="Toplamlar">
            <div className="stat">
              <span className="stat__n">{stats.spots}</span>
              <span className="stat__l">nokta temizlendi</span>
            </div>
            <div className="stat">
              <span className="stat__n">{formatKg(stats.kg)}</span>
              <span className="stat__l">kg atık toplandı</span>
            </div>
            <div className="stat">
              <span className="stat__n">{stats.volunteers}</span>
              <span className="stat__l">gönüllü katıldı</span>
            </div>
            <div className="stat">
              <span className="stat__n">{stats.rechecked}</span>
              <span className="stat__l">nokta yeniden kontrol edildi</span>
            </div>
          </div>

          {stats.demoOnly ? (
            <p className="note">
              Henüz gerçek bir çalışma kaydı yok. Haritadaki noktalar arayüzü göstermek için
              hazırlanmış örnek kayıtlardır ve toplamlara girmez.
            </p>
          ) : (
            <p className="note">Sayılar yalnızca tartıyla ölçülmüş ve teslim edilmiş atığı kapsar.</p>
          )}

          <div className="hero__cta">
            <Link href="/katil" className="btn btn--primary" title="Pazar temizliğine katıl">
              Pazar günü bize katıl
            </Link>
            <Link href="/hakkinda" className="btn btn--ghost" title="Yöntem ve ilkeler">
              Nasıl çalışıyoruz
            </Link>
          </div>
        </div>

        <MapLoader spots={spots} center={SITE.city.center} zoom={SITE.city.zoom} />
      </section>

      <Reveal as="section" className="wrap sec" id="calismalar">
        <div className="sec__head">
          <h2>Çalışmalar</h2>
          <p>En son çalışma en üstte.</p>
        </div>
        {spots.length === 0 ? (
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

      <Reveal as="section" className="wrap sec" id="destek">
        <div className="sec__head">
          <h2>Destekçiler</h2>
          <p>Her katkı, katkı verdiği noktada görünür.</p>
        </div>
        {sponsors.length === 0 ? (
          <div className="empty">
            Bu alan ilk destekçiyi bekliyor. Ekipman, atık kabulü ya da bütçe ile katkı vermek
            isterseniz{" "}
            <a href={`mailto:${SITE.contactEmail}`} title="Destekçi olmak için yazın">
              yazın
            </a>
            .
          </div>
        ) : (
          <div className="sponsors">
            {sponsors.map((sp) => (
              <div className="sponsor" key={sp.id}>
                <h3>
                  {sp.url ? (
                    <a href={sp.url} title={sp.name} rel="noopener">
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
    </main>
  );
}
