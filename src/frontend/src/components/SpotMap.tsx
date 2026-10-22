"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Spot, Trace } from "@/lib/types";
import { STATUS, STATUS_ORDER } from "@/lib/status";
import { spotTotals } from "@/lib/content";
import { formatKg, TRACE_KIND } from "@/lib/status";

/** Leaflet SVG'de CSS değişkeni çalışmaz, hex gerekir. globals.css ile aynı değerler. */
const HEX: Record<string, string> = {
  tespit_edildi: "#6e8089",
  planlandi: "#d59a2a",
  tamamlandi: "#2e7d4f",
  yeniden_kontrol_edilecek: "#1e6b74",
  tekrar_kirlendi: "#b4452b",
};

/**
 * Tile kaynağı tek yerden değişsin: OSM'nin açık sunucusu küçük trafik için uygundur,
 * büyüyünce lisanslı bir sağlayıcıya (MapTiler, Stadia…) ya da kendi sunucumuza geçeriz.
 */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları';

/** Odak yalnızca Bandırma: harita bu sınırların dışına kaydırılamaz, çok uzaklaşılamaz. */
const CITY_BOUNDS: [[number, number], [number, number]] = [
  [40.29, 27.85],
  [40.42, 28.09],
];
const MIN_ZOOM = 12;
const MAX_ZOOM = 18;

function FitToSpots({ spots }: { spots: Spot[] }) {
  const map = useMap();
  useEffect(() => {
    if (spots.length < 2) return;
    map.fitBounds(
      spots.map((s) => s.coords),
      { padding: [40, 40], maxZoom: 15 },
    );
  }, [map, spots]);
  return null;
}

/** Gönüllü izleri: onaylı anonim bildirimler, çalışma noktasından ayrı (küçük, turuncu, dolu). */
const TRACE_HEX = "#d59a2a";

function traceDay(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function SpotMap({
  spots,
  traces = [],
  center,
  zoom,
}: {
  spots: Spot[];
  traces?: Trace[];
  center: [number, number];
  zoom: number;
}) {
  // Her mount'ta yeni anahtar: Next istemci gezinmesinde Leaflet aynı DOM kutusunu yeniden başlatmaya
  // kalkınca "Map container is already initialized" fırlatıyordu; bu, sayfayı hata sınırına düşürüyordu.
  const [mapKey] = useState(() => `map-${Math.random().toString(36).slice(2)}`);
  return (
    <>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={CITY_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom={false}
        style={{ height: "100%" }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} bounds={CITY_BOUNDS} />
        <FitToSpots spots={spots} />
        {traces.map((t) => (
          <CircleMarker
            key={t.id}
            center={t.coords}
            radius={6}
            pathOptions={{ color: "#ffffff", weight: 2, fillColor: TRACE_HEX, fillOpacity: 0.95 }}
          >
            <Popup>
              {/* eslint-disable-next-line @next/next/no-img-element -- API alanından gelen fotoğraf, remotePatterns gerekmesin */}
              <img className="pop__img" src={t.photoUrl} alt={`Gönüllü izi: ${TRACE_KIND[t.kind]}`} loading="lazy" />
              <div className="pop__t">Gönüllü izi</div>
              <div className="pop__m">
                {TRACE_KIND[t.kind]} · {traceDay(t.createdAt)}
                {t.note && <> · {t.note}</>}
              </div>
              <Link href="/iz-birak" title="Sen de iz bırak">Sen de iz bırak</Link>
            </Popup>
          </CircleMarker>
        ))}
        {spots.map((s) => {
          const t = spotTotals(s);
          return (
            <CircleMarker
              key={s.slug}
              center={s.coords}
              radius={10}
              pathOptions={{
                color: HEX[s.status],
                weight: 3,
                fillColor: "#ffffff",
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div className="pop__t">{s.title}</div>
                <div className="pop__m">
                  {s.district} · {STATUS[s.status].label}
                  {t.kgMeasured > 0 && <> · {formatKg(t.kgMeasured)} kg tartıldı</>}
                  {s.demo && <> · örnek kayıt</>}
                </div>
                <Link href={`/nokta/${s.slug}`} title={`${s.title} kaydını aç`}>Kaydı aç</Link>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="map__legend" aria-label="Durum renkleri">
        {STATUS_ORDER.map((k) => (
          <span className="legend__i" key={k}>
            <span className="dot" style={{ background: HEX[k] }} />
            {STATUS[k].label}
          </span>
        ))}
        {traces.length > 0 && (
          <span className="legend__i">
            <span className="dot" style={{ background: TRACE_HEX }} />
            Gönüllü izi
          </span>
        )}
      </div>
    </>
  );
}
