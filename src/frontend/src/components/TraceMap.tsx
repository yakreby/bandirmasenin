"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** Tile adresi SpotMap.tsx ile aynı; büyüyünce ikisi birden değişir. */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları';

const CITY_BOUNDS: [[number, number], [number, number]] = [
  [40.29, 27.85],
  [40.42, 28.09],
];

/** Görsel dosyası yok: işaret saf CSS (globals .trace-pin). */
const PIN = L.divIcon({ className: "trace-pin-wrap", html: '<span class="trace-pin"></span>', iconSize: [28, 36], iconAnchor: [14, 34] });

function Follow({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.setView(pos, Math.max(map.getZoom(), 17), { animate: true });
  }, [map, pos]);
  return null;
}

function ClickToPlace({ onPick }: { onPick: (p: [number, number]) => void }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

/**
 * İz bırak formundaki küçük harita: konum alınınca oraya gider, işaret sürüklenerek ya da
 * haritaya dokunarak düzeltilir. Konum izni yoksa şehir merkezinden açılır.
 */
export default function TraceMap({
  pos,
  onChange,
  center,
}: {
  pos: [number, number] | null;
  onChange: (p: [number, number]) => void;
  center: [number, number];
}) {
  const [key] = useState(() => `trace-${Math.random().toString(36).slice(2)}`);
  const handlers = useMemo(
    () => ({
      dragend: (e: L.DragEndEvent) => {
        const ll = (e.target as L.Marker).getLatLng();
        onChange([ll.lat, ll.lng]);
      },
    }),
    [onChange],
  );

  return (
    <MapContainer
      key={key}
      center={pos ?? center}
      zoom={pos ? 17 : 13}
      minZoom={12}
      maxZoom={19}
      maxBounds={CITY_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom={false}
      style={{ height: "100%" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19} />
      <Follow pos={pos} />
      <ClickToPlace onPick={onChange} />
      {pos && <Marker position={pos} icon={PIN} draggable eventHandlers={handlers} />}
    </MapContainer>
  );
}
