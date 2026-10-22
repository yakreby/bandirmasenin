"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Sayfa düzeyinde beklenmeyen hata (5xx karşılığı). Kabuk (header/footer) korunur. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="wrap">
      <article className="errpage">
        <div className="errpage__code">500</div>
        <h1>Bir şeyler ters gitti.</h1>
        <p>
          Sayfa yüklenirken beklenmeyen bir hata oluştu. Sorun bizim tarafımızda; tekrar denemek
          çoğu zaman yeterli olur.
        </p>
        <div className="errpage__actions">
          <button type="button" className="btn btn--primary" onClick={() => reset()}>
            Tekrar dene
          </button>
          <Link href="/" className="btn btn--ghost" title="Ana sayfaya dön">
            Haritaya dön
          </Link>
        </div>
        {error.digest && <div className="errpage__ref">Hata kodu: {error.digest}</div>}
      </article>
    </main>
  );
}
