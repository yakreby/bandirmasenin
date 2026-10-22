"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, CONSENT_KEY, type Consent } from "./consent";

/**
 * Google Analytics 4. Yalnızca çerez bildiriminde "Kabul et" seçildiyse yüklenir;
 * "Yalnızca gerekli" seçen ziyaretçi için hiç istek atılmaz. (Liman kuralı: onay yoksa analitik yok.)
 * gtag.js Google'ın kendi alanından gelir; lokal servis edilemez, bu bilinçli bir istisnadır.
 */
export default function Analytics({ id }: { id?: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setAllowed(localStorage.getItem(CONSENT_KEY) === "all");
      } catch {
        setAllowed(false);
      }
    };
    read();
    const onConsent = (e: Event) => setAllowed((e as CustomEvent<Consent>).detail === "all");
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  if (!id || !allowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
