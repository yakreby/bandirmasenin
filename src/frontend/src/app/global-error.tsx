"use client";

/** Kök düzen bile çökerse gösterilir; globals.css yüklenmediği için stiller satır içi. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f3f6f1",
          color: "#14241c",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <div style={{ color: "#2e7d4f", fontWeight: 800, marginBottom: 8 }}>500</div>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "0 0 12px" }}>Site şu anda açılamıyor.</h1>
          <p style={{ color: "#4a5c53", fontSize: 17, lineHeight: 1.5, margin: 0 }}>
            Beklenmeyen bir hata oluştu. Birkaç saniye sonra tekrar deneyin.
          </p>
          <p style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                font: "inherit",
                fontWeight: 700,
                padding: "11px 18px",
                borderRadius: 999,
                border: 0,
                background: "#2e7d4f",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Tekrar dene
            </button>
          </p>
          {error.digest && <p style={{ fontSize: 12, color: "#78877f" }}>Hata kodu: {error.digest}</p>}
        </div>
      </body>
    </html>
  );
}
