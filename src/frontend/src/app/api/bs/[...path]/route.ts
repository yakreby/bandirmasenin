import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Oturumlu API köprüsü: /api/bs/<yol> → API_URL/api/<yol>, Bearer çerezden eklenir.
 * Hesap ve yönetim paneli bunu kullanır; JWT tarayıcıya çıkmaz.
 */
const API = process.env.API_URL?.replace(/\/$/, "");
const COOKIE = "bs_session";

async function forward(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  if (!API) return NextResponse.json({ error: "API tanımlı değil." }, { status: 503 });

  const { path } = await ctx.params;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

  const url = new URL(req.url);
  const target = `${API}/api/${path.map(encodeURIComponent).join("/")}${url.search}`;
  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const r = await fetch(target, {
    method: req.method,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
      ...(hasBody ? { "content-type": req.headers.get("content-type") ?? "application/json" } : {}),
    },
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  }).catch(() => null);

  if (!r) return NextResponse.json({ error: "API'ye ulaşılamadı." }, { status: 502 });

  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: {
      "content-type": r.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
