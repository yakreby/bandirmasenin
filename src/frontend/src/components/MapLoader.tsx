"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { Spot, Trace } from "@/lib/types";

const SpotMap = dynamic(() => import("./SpotMap"), {
  ssr: false,
  loading: () => <div className="map__loading">Harita yükleniyor</div>,
});

/**
 * Leaflet, Next'in istemci gezinmesinde ara sıra "Map container is being reused by another instance" /
 * "_initContainer appendChild" fırlatıyor (eski ve yeni sayfa ağacı kısa süre aynı anda yaşıyor).
 * Bu sınır hatayı yakalar, haritayı yeni anahtarla bir-iki kez yeniden kurar; yine olmazsa sakin bir
 * mesaj gösterir. Sayfanın geri kalanı hiçbir durumda hata ekranına düşmez.
 */
class MapBoundary extends Component<{ children: (attempt: number) => ReactNode }, { attempt: number; dead: boolean }> {
  state = { attempt: 0, dead: false };

  static getDerivedStateFromError() {
    return null;
  }

  componentDidCatch(err: unknown) {
    console.warn("[harita] Leaflet hatası, yeniden kuruluyor:", err);
    if (this.state.attempt < 2) this.setState((s) => ({ attempt: s.attempt + 1 }));
    else this.setState({ dead: true });
  }

  render() {
    if (this.state.dead) {
      return <div className="map__loading">Harita yüklenemedi. Sayfayı yenileyince düzelir.</div>;
    }
    return this.props.children(this.state.attempt);
  }
}

export default function MapLoader(props: { spots: Spot[]; traces?: Trace[]; center: [number, number]; zoom: number }) {
  // Yalnızca tarayıcıda, bir sonraki karede kur: eski sayfanın haritası sökülmeden yenisi aynı kutuya girmesin.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="map">
      {ready ? (
        <MapBoundary>{(attempt) => <SpotMap key={`attempt-${attempt}`} {...props} />}</MapBoundary>
      ) : (
        <div className="map__loading">Harita yükleniyor</div>
      )}
    </div>
  );
}
