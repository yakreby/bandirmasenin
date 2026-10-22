"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  src: string;
  alt: string;
  caption: string;
}

const INTERVAL_MS = 6500;

/**
 * Hero arka planı: Bandırma fotoğrafları arasında yumuşak geçiş. Kütüphane yok (CDN kuralı);
 * CSS opacity geçişi + hafif yaklaşma. Üzerine gelince ve sekme arka plandayken durur.
 * İlk kare `priority` ile gelir, diğerleri tarayıcı boşken yüklenir.
 */
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const timer = useRef<number | null>(null);

  const go = useCallback((to: number) => setI(((to % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const tick = () => setI((v) => (v + 1) % n);
    timer.current = window.setInterval(tick, INTERVAL_MS);
    const onVis = () => {
      if (document.hidden && timer.current) {
        window.clearInterval(timer.current);
        timer.current = null;
      } else if (!document.hidden && !timer.current) {
        timer.current = window.setInterval(tick, INTERVAL_MS);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [paused, n]);

  return (
    <div
      className="hero__slides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="fotoğraf geçişi"
    >
      {slides.map((s, idx) => (
        <div key={s.src} className={`hero__slide${idx === i ? " hero__slide--on" : ""}`} aria-hidden={idx !== i}>
          <Image src={s.src} alt={s.alt} fill priority={idx === 0} sizes="100vw" className="hero__img" />
        </div>
      ))}

      {n > 1 && (
        <div className="hero__ctrl">
          <button type="button" className="hero__arrow" aria-label="Önceki fotoğraf" title="Önceki" onClick={() => go(i - 1)}>
            <ChevronLeft size={18} aria-hidden />
          </button>
          <div className="hero__dots" role="tablist" aria-label="Fotoğraflar">
            {slides.map((s, idx) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={s.caption}
                title={s.caption}
                className={`hero__dot${idx === i ? " hero__dot--on" : ""}`}
                onClick={() => go(idx)}
              />
            ))}
          </div>
          <button type="button" className="hero__arrow" aria-label="Sonraki fotoğraf" title="Sonraki" onClick={() => go(i + 1)}>
            <ChevronRight size={18} aria-hidden />
          </button>
          <span className="hero__caption" aria-live="polite">
            {slides[i].caption}
          </span>
        </div>
      )}
    </div>
  );
}
