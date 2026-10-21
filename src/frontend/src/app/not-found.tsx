import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <article className="prose">
        <h1>Bu sayfa haritada yok.</h1>
        <p className="lead">
          Aradığınız kayıt taşınmış ya da hiç olmamış olabilir. Tüm noktalar ana sayfadaki haritada.
        </p>
        <p>
          <Link href="/" className="btn btn--primary" title="Ana sayfaya dön">
            Haritaya dön
          </Link>
        </p>
      </article>
    </main>
  );
}
