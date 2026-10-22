"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_EVENT, CONSENT_KEY, type Consent } from "./consent";

/**
 * Sitenin kendi onay bileşeni. Analitik (Google Analytics) yalnızca "Kabul et" sonrası yüklenir;
 * tercih tarayıcının yerel depolamasında tutulur, sunucuya gitmez.
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setShow(true);
    } catch {
      /* özel pencere vb. */
    }
  }, []);

  const decide = (value: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* yoksay */
    }
    window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie" role="dialog" aria-live="polite" aria-label="Çerez bildirimi">
      <p>
        Siteyi nasıl kullandığınızı anlamak için Google Analytics kullanıyoruz; yalnızca kabul
        ederseniz yüklenir. Reklam çerezi yok. Harita karoları OpenStreetMap sunucularından gelir.{" "}
        <Link href="/cerez-politikasi" title="Çerez politikasını oku">
          Ayrıntılar
        </Link>
      </p>
      <div className="cookie__btns">
        <button type="button" className="btn btn--ghost" onClick={() => decide("necessary")}>
          Yalnızca gerekli
        </button>
        <button type="button" className="btn btn--primary" onClick={() => decide("all")}>
          Kabul et
        </button>
      </div>
    </div>
  );
}
