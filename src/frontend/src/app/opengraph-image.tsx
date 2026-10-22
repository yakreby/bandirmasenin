import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Bandırma Senin: Şehrine sahip çık. Değişimi gör.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const mark = await readFile(join(process.cwd(), "public/images/bs-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
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
          background: "#f3f6f1",
          color: "#14241c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={56} height={56} alt="" />
          Bandırma Senin
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            Bu şehir hepimizin.
          </div>
          <div style={{ fontSize: 34, color: "#4a5c53" }}>
            Temizliyoruz, tartıyoruz, bir ay sonra geri dönüp bakıyoruz.
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#2e7d4f" }}>bandirmasenin.com</div>
      </div>
    ),
    size,
  );
}
