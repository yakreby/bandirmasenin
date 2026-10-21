"use client";

import dynamic from "next/dynamic";
import type { Spot } from "@/lib/types";

const SpotMap = dynamic(() => import("./SpotMap"), {
  ssr: false,
  loading: () => <div className="map__loading">Harita yükleniyor</div>,
});

export default function MapLoader(props: { spots: Spot[]; center: [number, number]; zoom: number }) {
  return (
    <div className="map">
      <SpotMap {...props} />
    </div>
  );
}
