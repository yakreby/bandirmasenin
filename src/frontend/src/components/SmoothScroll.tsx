"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Sayfa kaydırmasını yumuşatır (Liman3DWebsite'daki ayarlar). Çapa linkleri ve rota değişimi Lenis üzerinden. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
      anchors: { offset: -84 },
      autoRaf: true,
    });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  /* Rota değişince: hash varsa oraya, yoksa tepeye. Ham scrollTo Lenis'in sonraki karesinde geri alınır, o yüzden Lenis ile. */
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        lenis.scrollTo(el as HTMLElement, { offset: -84, immediate: false });
        return;
      }
    }
    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
