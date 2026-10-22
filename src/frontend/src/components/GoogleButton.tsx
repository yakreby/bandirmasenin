"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: string }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, string | number>) => void;
        };
      };
    };
  }
}

/**
 * "Google ile devam et". Google Identity Services betiği yalnızca bu sayfada ve yalnızca
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID tanımlıysa yüklenir (CDN kuralının bilinçli istisnası: Google'ın
 * kimlik betiği başka yerden servis edilemez). Kimlik yoksa düğme hiç görünmez.
 */
export default function GoogleButton({ next }: { next: string }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string>();

  useEffect(() => {
    if (!clientId || !box.current) return;
    const el = box.current;

    const render = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (r) => {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ idToken: r.credential }),
          });
          if (res.ok) {
            router.push(next);
            router.refresh();
          } else {
            const p = (await res.json().catch(() => null)) as { error?: string } | null;
            setErr(p?.error ?? "Google ile giriş yapılamadı.");
          }
        },
      });
      window.google.accounts.id.renderButton(el, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        locale: "tr",
        width: 320,
      });
    };

    if (window.google) {
      render();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = render;
    document.head.appendChild(s);
  }, [clientId, next, router]);

  if (!clientId) return null;

  return (
    <div className="gbtn">
      <div className="gbtn__or">ya da</div>
      <div ref={box} />
      {err && (
        <div className="form__status form__status--err" role="alert">
          {err}
        </div>
      )}
    </div>
  );
}
