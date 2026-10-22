import { NextResponse } from "next/server";

/**
 * İz bırak köprüsü: tarayıcı multipart (fotoğraf + konum) gönderir, biz .NET API'ye iletiriz.
 * Anonim uçtur, oturum gerekmez. API adresi sunucuda kalır. Vercel gövde sınırı 4,5 MB;
 * istemci fotoğrafı 1600px JPEG'e küçültür.
 */
const API = process.env.API_URL?.replace(/\/$/, "");

export async function POST(req: Request) {
  if (!API) {
    return NextResponse.json({ error: "İz bırakma şu an kapalı. Lütfen iletişim formunu kullanın." }, { status: 503 });
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  try {
    const r = await fetch(`${API}/api/traces`, {
      method: "POST",
      headers: { accept: "application/json", ...(ip ? { "x-forwarded-for": ip } : {}) },
      body: fd,
    });

    if (r.status === 429) {
      return NextResponse.json({ error: "Kısa sürede çok fazla iz bırakıldı. Biraz sonra tekrar deneyin." }, { status: 429 });
    }
    if (r.status === 413) {
      return NextResponse.json({ error: "Fotoğraf çok büyük. Daha küçük bir fotoğraf deneyin." }, { status: 413 });
    }
    if (r.status === 400) {
      const p = (await r.json().catch(() => null)) as { errors?: Record<string, string[]>; detail?: string } | null;
      const first = p?.errors ? Object.values(p.errors).flat()[0] : p?.detail;
      return NextResponse.json({ error: first ?? "Alanları kontrol edin." }, { status: 400 });
    }
    if (!r.ok) throw new Error(`API ${r.status}`);
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (err) {
    console.error("[trace] API hatası", err);
    return NextResponse.json({ error: "İz iletilemedi. Lütfen tekrar deneyin." }, { status: 502 });
  }
}
