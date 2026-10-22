"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Camera, Crosshair, RefreshCw, Send, Check, MapPin } from "lucide-react";
import type { TraceKind } from "@/lib/types";
import { TRACE_KIND } from "@/lib/status";

const TraceMap = dynamic(() => import("./TraceMap"), {
  ssr: false,
  loading: () => <div className="map__loading">Harita yükleniyor</div>,
});

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;
const KINDS = Object.keys(TRACE_KIND) as TraceKind[];

/**
 * Fotoğrafı tarayıcıda küçültür: uzun kenar 1600px, JPEG. Yükleme küçülür (Vercel 4,5 MB sınırı),
 * EXIF (ve içindeki konum/cihaz bilgisi) atılır; konum yalnız cihazın o anki konumundan gelir.
 */
async function shrink(file: File): Promise<Blob> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // tarayıcı çözemedi (ör. HEIC); sunucu türü kontrol eder
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bmp.close();
    return file;
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", JPEG_QUALITY));
  return blob ?? file;
}

type Geo = "idle" | "asking" | "ok" | "denied" | "unsupported";

export default function TraceForm({ center }: { center: [number, number] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [busyPhoto, setBusyPhoto] = useState(false);
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [acc, setAcc] = useState<number | null>(null);
  const [geo, setGeo] = useState<Geo>("idle");
  const [kind, setKind] = useState<TraceKind>("karisik");
  const [state, setState] = useState<{ status: "idle" | "sending" | "ok" | "err"; msg?: string }>({ status: "idle" });

  useEffect(() => {
    if (!photo) return;
    const url = photo.url;
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeo("unsupported");
      return;
    }
    setGeo("asking");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos([p.coords.latitude, p.coords.longitude]);
        setAcc(p.coords.accuracy ?? null);
        setGeo("ok");
      },
      () => setGeo("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusyPhoto(true);
    try {
      const blob = await shrink(f);
      if (photo) URL.revokeObjectURL(photo.url);
      setPhoto({ blob, url: URL.createObjectURL(blob) });
      if (!pos && geo === "idle") locate(); // fotoğraf çekildi, konum da o an alınsın
    } finally {
      setBusyPhoto(false);
      e.target.value = "";
    }
  }

  const onPick = useCallback((p: [number, number]) => {
    setPos(p);
    setAcc(null); // elle düzeltildi; cihaz doğruluğu artık geçerli değil
    if (geo !== "ok") setGeo("ok");
  }, [geo]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photo || !pos) return;
    const form = e.currentTarget;
    const fd = new FormData();
    fd.set("photo", photo.blob, "iz.jpg");
    fd.set("latitude", String(pos[0]));
    fd.set("longitude", String(pos[1]));
    if (acc != null) fd.set("accuracy", String(Math.round(acc)));
    fd.set("kind", kind);
    const note = (form.elements.namedItem("note") as HTMLTextAreaElement | null)?.value.trim();
    if (note) fd.set("note", note);
    fd.set("website", (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "");

    setState({ status: "sending" });
    try {
      const r = await fetch("/api/trace", { method: "POST", body: fd });
      if (r.ok) {
        setState({ status: "ok" });
        return;
      }
      const p = (await r.json().catch(() => null)) as { error?: string } | null;
      setState({ status: "err", msg: p?.error ?? "Gönderilemedi." });
    } catch {
      setState({ status: "err", msg: "Bağlantı kurulamadı. Lütfen tekrar deneyin." });
    }
  }

  if (state.status === "ok") {
    return (
      <div className="trace__done" role="status">
        <span className="trace__done-ico">
          <Check size={22} aria-hidden />
        </span>
        <h2>İzin bırakıldı.</h2>
        <p>
          Gönüllü ekip baktıktan sonra haritaya düşer ve bir sonraki Pazar planına girer. Teşekkürler.
        </p>
        <div className="hero__cta">
          <Link href="/#harita" className="btn btn--primary" title="Haritaya dön">
            Haritaya dön
          </Link>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setPhoto(null);
              setState({ status: "idle" });
            }}
          >
            Bir iz daha
          </button>
        </div>
      </div>
    );
  }

  const ready = !!photo && !!pos && state.status !== "sending";

  return (
    <form className="form trace" onSubmit={onSubmit}>
      <ol className="trace__steps">
        <li className="trace__step">
          <span className="trace__n">1</span>
          <div className="trace__body">
            <h2>Fotoğraf</h2>
            <input
              ref={fileRef}
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              capture="environment"
              className="hp"
              aria-label="Fotoğraf çek"
              onChange={onFile}
            />
            {photo ? (
              <figure className="trace__shot">
                {/* eslint-disable-next-line @next/next/no-img-element -- yerel blob URL, next/image kapsamı dışı */}
                <img src={photo.url} alt="Çektiğiniz fotoğraf" />
                <button type="button" className="btn btn--light btn--sm trace__retake" onClick={() => fileRef.current?.click()}>
                  <RefreshCw size={14} aria-hidden />
                  Yeniden çek
                </button>
              </figure>
            ) : (
              <button type="button" className="trace__cam" onClick={() => fileRef.current?.click()} disabled={busyPhoto}>
                <Camera size={28} aria-hidden />
                <span>{busyPhoto ? "Hazırlanıyor" : "Kamerayı aç"}</span>
                <small>ya da galeriden seç</small>
              </button>
            )}
            <span className="field__hint">Yalnız çöp ve çevresi görünsün; yüz, plaka, kişi olmasın.</span>
          </div>
        </li>

        <li className="trace__step">
          <span className="trace__n">2</span>
          <div className="trace__body">
            <h2>Konum</h2>
            <div className="trace__geo">
              <button type="button" className="btn btn--ghost btn--sm" onClick={locate} disabled={geo === "asking"}>
                <Crosshair size={16} aria-hidden />
                {geo === "asking" ? "Konum alınıyor" : pos ? "Konumu yenile" : "Konumumu al"}
              </button>
              <span className="trace__geo-txt">
                {geo === "denied" && "Konum izni verilmedi; işareti haritaya dokunarak koyabilirsin."}
                {geo === "unsupported" && "Bu tarayıcı konum vermiyor; işareti haritaya dokunarak koy."}
                {geo === "idle" && !pos && "Fotoğrafı çekince konum da alınır; istersen şimdi al."}
                {pos && (
                  <>
                    <MapPin size={13} aria-hidden /> {pos[0].toFixed(5)}, {pos[1].toFixed(5)}
                    {acc != null && <> · ±{Math.round(acc)} m</>}
                  </>
                )}
              </span>
            </div>
            <div className="trace__map">
              <TraceMap pos={pos} onChange={onPick} center={center} />
            </div>
            <span className="field__hint">İşareti sürükleyerek ya da haritaya dokunarak düzeltebilirsin.</span>
          </div>
        </li>

        <li className="trace__step">
          <span className="trace__n">3</span>
          <div className="trace__body">
            <h2>Birkaç bilgi</h2>
            <div className="field">
              <label htmlFor="kind">Ne gördün</label>
              <select id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value as TraceKind)}>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {TRACE_KIND[k]}
                  </option>
                ))}
              </select>
              {kind === "tehlikeli" && (
                <span className="field__hint">Tehlikeli atığa dokunma. Bildirimin gelir, belediyeye de iletiriz.</span>
              )}
            </div>
            <div className="field">
              <label htmlFor="note">Kısa not (isteğe bağlı)</label>
              <textarea id="note" name="note" maxLength={300} rows={3} placeholder="Ne zamandır burada, ne kadar yer kaplıyor?" />
            </div>

            <div className="hp" aria-hidden="true">
              <label htmlFor="website">Web sitesi</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <label className="check">
              <input id="anon" name="anon" type="checkbox" required />
              <span>
                Fotoğrafta kişi ya da plaka yok. Fotoğrafın ve işaretlediğim konumun, onaydan sonra haritada
                anonim olarak yayımlanmasını kabul ediyorum.{" "}
                <Link href="/kvkk-aydinlatma" title="KVKK aydınlatma metnini oku" target="_blank">
                  Aydınlatma metni
                </Link>
              </span>
            </label>

            {state.status === "err" && (
              <div className="form__status form__status--err" role="alert">
                {state.msg}
              </div>
            )}

            <div>
              <button type="submit" className="btn btn--primary" disabled={!ready}>
                <Send size={16} aria-hidden />
                {state.status === "sending" ? "Gönderiliyor" : "İzi bırak"}
              </button>
              {!photo && <span className="field__hint trace__why">Önce fotoğraf gerekli.</span>}
              {photo && !pos && <span className="field__hint trace__why">Konum bekleniyor.</span>}
            </div>
          </div>
        </li>
      </ol>
    </form>
  );
}
