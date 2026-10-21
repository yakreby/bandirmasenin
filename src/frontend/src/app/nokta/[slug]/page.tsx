import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSpot, fetchSpots, fetchSponsors } from "@/lib/data";
import { heroPhotos, lastDate, spotTotals } from "@/lib/content";
import { formatDate, formatKg, KIND, MATERIAL, STATUS } from "@/lib/status";
import type { Material } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import BeforeAfter from "@/components/BeforeAfter";
import StatusBadge from "@/components/StatusBadge";
import JsonLd from "@/components/JsonLd";


type Props = { params: Promise<{ slug: string }> };

const MATERIAL_HEX: Record<Material, string> = {
  plastik: "#1e6b74",
  cam: "#6fa3ab",
  metal: "#6e8089",
  kagit: "#c9a961",
  organik: "#4d7a2f",
  diger: "#b8b0a0",
};

const VISIT_KIND = { temizlik: "Temizlik", kontrol: "Kontrol", iyilestirme: "İyileştirme" };
const RECHECK = { temiz: "Temiz kalmış", kismen: "Kısmen kirlenmiş", tekrar_kirlendi: "Yeniden kirlenmiş" };

export async function generateStaticParams() {
  const spots = await fetchSpots();
  return spots.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spot = await fetchSpot(slug);
  if (!spot) return {};
  const t = spotTotals(spot);
  const desc = `${spot.district}. ${STATUS[spot.status].label}${t.kg > 0 ? `, ${formatKg(t.kg)} kg atık toplandı` : ""}. ${spot.summary}`;
  return {
    title: spot.title,
    description: desc,
    alternates: { canonical: `/nokta/${spot.slug}` },
    openGraph: {
      title: `${spot.title}, ${spot.district}`,
      description: desc,
      url: `/nokta/${spot.slug}`,
      type: "article",
    },
  };
}

export default async function SpotPage({ params }: Props) {
  const { slug } = await params;
  const spot = await fetchSpot(slug);
  if (!spot) notFound();

  const sponsors = await fetchSponsors();
  const t = spotTotals(spot);
  const photos = heroPhotos(spot);
  const last = lastDate(spot);
  const [lat, lng] = spot.coords;
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  const mix = (Object.entries(t.byMaterial) as [Material, number][]).sort((a, b) => b[1] - a[1]);
  const spotSponsors = (spot.sponsorIds ?? [])
    .map((id) => sponsors.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const visits = [...spot.visits].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Çalışmalar", href: "/#calismalar" }, { name: spot.title }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: spot.title,
          description: spot.summary,
          address: { "@type": "PostalAddress", addressLocality: "Bandırma", addressRegion: "Balıkesir", addressCountry: "TR" },
          geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
        }}
      />

      <header className="detail__head">
        <h1>{spot.title}</h1>
        <div className="detail__meta">
          <StatusBadge status={spot.status} />
          <span>{spot.district}</span>
          <span>{KIND[spot.kind]}</span>
          {spot.demo && <span className="stamp">örnek kayıt</span>}
        </div>
        <p className="detail__sum">{spot.summary}</p>
      </header>

      <BeforeAfter before={photos.before} after={photos.after} title={spot.title} />

      <div className="facts" aria-label="Özet">
        <div className="fact">
          <div className="fact__l">Son çalışma</div>
          <div className="fact__v">{last ? formatDate(last) : "Henüz yok"}</div>
        </div>
        <div className="fact">
          <div className="fact__l">Toplanan atık</div>
          <div className="fact__v">{t.kg > 0 ? `${formatKg(t.kg)} kg` : "Henüz yok"}</div>
          {t.kg > 0 && (
            <div className="fact__s">
              {formatKg(t.kgMeasured)} kg tartıldı
              {t.kg - t.kgMeasured > 0.05 && `, ${formatKg(t.kg - t.kgMeasured)} kg tahmin`}
            </div>
          )}
        </div>
        <div className="fact">
          <div className="fact__l">Gönüllü</div>
          <div className="fact__v">{t.volunteers > 0 ? t.volunteers : "Henüz yok"}</div>
        </div>
        <div className="fact">
          <div className="fact__l">30 gün kontrolü</div>
          <div className="fact__v">
            {spot.recheck
              ? RECHECK[spot.recheck.result]
              : spot.recheckDue
                ? formatDate(spot.recheckDue)
                : "Planlanmadı"}
          </div>
          {spot.recheck && <div className="fact__s">{formatDate(spot.recheck.date)}</div>}
        </div>
      </div>

      <div className="detail__grid">
        <section>
          <h2>Ziyaretler</h2>
          <ol className="timeline">
            {visits.map((v, i) => (
              <li key={i}>
                <div className="timeline__d">{formatDate(v.date)}</div>
                <h3>
                  {VISIT_KIND[v.kind]}
                  {v.volunteers > 0 && `, ${v.volunteers} kişi`}
                </h3>
                {v.team && <p>{v.team}</p>}
                {v.weighings && v.weighings.length > 0 && (
                  <p>
                    {v.weighings
                      .map((w) => `${MATERIAL[w.material]} ${formatKg(w.kg)} kg${w.method === "tahmin" ? " (tahmin)" : ""}`)
                      .join(", ")}
                  </p>
                )}
                {v.deliveredTo && <p>Teslim: {v.deliveredTo}</p>}
                {v.notes && <p>{v.notes}</p>}
              </li>
            ))}
          </ol>
        </section>

        <aside className="side">
          {spot.recheck ? (
            <div className={`recheck ${spot.recheck.result === "temiz" ? "recheck--ok" : "recheck--bad"}`}>
              <h3>30 gün sonra: {RECHECK[spot.recheck.result].toLowerCase()}</h3>
              <p>
                {formatDate(spot.recheck.date)}
                {spot.recheck.note && `. ${spot.recheck.note}`}
              </p>
            </div>
          ) : spot.recheckDue ? (
            <div className="recheck recheck--due">
              <h3>Kontrol tarihi: {formatDate(spot.recheckDue)}</h3>
              <p>Aynı açıdan yeni fotoğraf çekilecek, sonucu iyi ya da kötü buraya yazılacak.</p>
            </div>
          ) : null}

          {mix.length > 0 && (
            <div>
              <h3>Atık karışımı</h3>
              <div className="mix__bar" aria-hidden>
                {mix.map(([m, kg]) => (
                  <div key={m} className="mix__seg" style={{ width: `${(kg / t.kg) * 100}%`, background: MATERIAL_HEX[m] }} />
                ))}
              </div>
              <ul className="mix__list">
                {mix.map(([m, kg]) => (
                  <li key={m}>
                    <span className="dot" style={{ background: MATERIAL_HEX[m] }} aria-hidden />
                    <span>{MATERIAL[m]}</span>
                    <span>{formatKg(kg)} kg</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3>Künye</h3>
            <dl className="kv">
              <dt>Konum</dt>
              <dd>
                <a href={osm} title="OpenStreetMap'te aç" rel="noopener">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </a>
              </dd>
              {spot.adoptedBy && (
                <>
                  <dt>Sahiplenen</dt>
                  <dd>{spot.adoptedBy}</dd>
                </>
              )}
              {spotSponsors.length > 0 && (
                <>
                  <dt>Destekçi</dt>
                  <dd>{spotSponsors.map((s) => s.name).join(", ")}</dd>
                </>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
