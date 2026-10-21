import { ImageResponse } from "next/og";

export const alt = "Bandırma Senin: Şehrine sahip çık. Değişimi gör.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f4f6f2",
          color: "#15262c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              border: "5px solid #1e6b74",
              display: "flex",
            }}
          />
          Bandırma Senin
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            Bu şehir hepimizin.
          </div>
          <div style={{ fontSize: 34, color: "#4c5e64" }}>
            Temizliyoruz, tartıyoruz, bir ay sonra geri dönüp bakıyoruz.
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#1e6b74" }}>bandirmasenin.com</div>
      </div>
    ),
    size,
  );
}
