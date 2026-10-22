import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <article className="errpage">
        <div className="errpage__code">404</div>
        <h1>Bu sayfa haritada yok.</h1>
        <p>
          Aradığınız kayıt taşınmış ya da hiç olmamış olabilir. Tüm noktalar ana sayfadaki haritada;
          bir noktayı arıyorsanız oradan bulmak en kısa yol.
        </p>
        <div className="errpage__actions">
          <Link href="/" className="btn btn--primary" title="Ana sayfaya dön">
            Haritaya dön
          </Link>
          <Link href="/iletisim" className="btn btn--ghost" title="Bize yazın">
            Bir sorun mu var, yazın
          </Link>
        </div>
      </article>
    </main>
  );
}
