"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "bs-cookie-consent";

/**
 * Sitenin kendi onay bileşeni. Şu an analitik veya pazarlama çerezi yazılmıyor;
 * ileride eklenirse yalnızca onaydan sonra yüklenir (consent === "all").
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* özel pencere vb. */
    }
  }, []);

  const decide = (value: "necessary" | "all") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* yoksay */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie" role="dialog" aria-live="polite" aria-label="Çerez bildirimi">
      <p>
        Bu site yalnızca çalışması için gereken verileri tarayıcınızda tutar; analitik veya reklam
        çerezi kullanmaz. Harita karoları OpenStreetMap sunucularından yüklenir.{" "}
        <Link href="/cerez-politikasi" title="Çerez politikasını oku">
          Ayrıntılar
        </Link>
      </p>
      <div className="cookie__btns">
        <button type="button" className="btn btn--ghost" onClick={() => decide("necessary")}>
          Yalnızca gerekli
        </button>
        <button type="button" className="btn btn--primary" onClick={() => decide("all")}>
          Tamam
        </button>
      </div>
    </div>
  );
}
