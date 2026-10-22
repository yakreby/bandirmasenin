import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Kimlik köprüsü (BFF). JWT tarayıcıya hiç verilmez: HttpOnly çerezde durur, API'ye biz taşırız.
 *   POST /api/auth/login     { email, password }            → çerez yazar, kullanıcıyı döner
 *   POST /api/auth/register  { fullName, email, password… } → çerez yazar, kullanıcıyı döner
 *   POST /api/auth/logout                                   → çerezi siler
 *   GET  /api/auth/me                                       → kullanıcı ya da 401
 */

const API = process.env.API_URL?.replace(/\/$/, "");
export const COOKIE = "bs_session";

function unavailable() {
  return NextResponse.json({ error: "Üyelik şu an kapalı. Lütfen daha sonra deneyin." }, { status: 503 });
}

async function readError(r: Response): Promise<string> {
  const p = (await r.json().catch(() => null)) as { detail?: string; title?: string; errors?: Record<string, string[]> } | null;
  if (p?.errors) return Object.values(p.errors).flat()[0] ?? "İstek reddedildi.";
  return p?.detail ?? p?.title ?? "İstek reddedildi.";
}

export async function GET(_req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (action !== "me") return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 404 });
  if (!API) return NextResponse.json(null, { status: 401 });

  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return NextResponse.json(null, { status: 401 });

  const r = await fetch(`${API}/api/auth/me`, {
    headers: { authorization: `Bearer ${token}`, accept: "application/json" },
    cache: "no-store",
  }).catch(() => null);

  if (!r || !r.ok) {
    const res = NextResponse.json(null, { status: 401 });
    if (r && r.status === 401) res.cookies.delete(COOKIE);
    return res;
  }
  return NextResponse.json(await r.json(), { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(COOKIE);
    return res;
  }

  if (action !== "login" && action !== "register") {
    return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 404 });
  }
  if (!API) return unavailable();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const r = await fetch(`${API}/api/auth/${action}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...(ip ? { "x-forwarded-for": ip } : {}),
    },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (!r) return NextResponse.json({ error: "API'ye ulaşılamadı." }, { status: 502 });
  if (r.status === 429) return NextResponse.json({ error: "Çok fazla deneme. Biraz sonra tekrar deneyin." }, { status: 429 });
  if (!r.ok) return NextResponse.json({ error: await readError(r) }, { status: r.status === 401 ? 401 : 400 });

  const data = (await r.json()) as { token: string; expiresAt: string; user: unknown };
  const res = NextResponse.json(data.user, { status: action === "register" ? 201 : 200 });
  res.cookies.set({
    name: COOKIE,
    value: data.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(data.expiresAt),
  });
  return res;
}
