import { NextResponse } from "next/server";

/**
 * İletişim formu köprüsü: tarayıcı buraya POST eder, biz .NET API'ye iletiriz.
 * API adresi sunucuda kalır; API yoksa form kapalı mesajı döner.
 */
const API = process.env.API_URL?.replace(/\/$/, "");

export async function POST(req: Request) {
  if (!API) {
    return NextResponse.json(
      { error: "Form şu an kapalı. Lütfen e-posta ile yazın." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  try {
    const r = await fetch(`${API}/api/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(ip ? { "x-forwarded-for": ip } : {}),
      },
      body: JSON.stringify(body),
    });

    if (r.status === 429) {
      return NextResponse.json({ error: "Kısa sürede çok fazla mesaj gönderildi. Biraz sonra tekrar deneyin." }, { status: 429 });
    }
    if (r.status === 400) {
      const p = (await r.json().catch(() => null)) as { errors?: Record<string, string[]> } | null;
      const first = p?.errors ? Object.values(p.errors).flat()[0] : undefined;
      return NextResponse.json({ error: first ?? "Alanları kontrol edin." }, { status: 400 });
    }
    if (!r.ok) throw new Error(`API ${r.status}`);
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (err) {
    console.error("[contact] API hatası", err);
    return NextResponse.json({ error: "Mesaj iletilemedi. Lütfen e-posta ile yazın." }, { status: 502 });
  }
}
