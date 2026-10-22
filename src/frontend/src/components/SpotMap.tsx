"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Spot } from "@/lib/types";
import { STATUS, STATUS_ORDER } from "@/lib/status";
import { spotTotals } from "@/lib/content";
import { formatKg } from "@/lib/status";

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

export default function SpotMap({
  spots,
  center,
  zoom,
}: {
  spots: Spot[];
  center: [number, number];
  zoom: number;
}) {
  return (
    <>
      <MapContainer
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
                  {t.kg > 0 && <> · {formatKg(t.kg)} kg</>}
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
      </div>
    </>
  );
}
