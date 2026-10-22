"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SessionUser } from "./AuthMenu";
import type { Trace, TraceStatus } from "@/lib/types";
import { formatDate, TRACE_KIND } from "@/lib/status";

interface AdminUser {
  id: string; fullName: string; email: string; phone?: string | null;
  status: "pending" | "approved" | "rejected"; roles: string[]; createdAt: string; approvedAt?: string | null; adminNote?: string | null;
}
interface Msg {
  id: string; kind: "katilim" | "nokta_oneri" | "destek" | "diger"; name: string; email: string; phone?: string | null;
  message: string; latitude?: number | null; longitude?: number | null; isRead: boolean; note?: string | null; createdAt: string;
}

const KIND = { katilim: "Katılım", nokta_oneri: "Nokta önerisi", destek: "Destek", diger: "Diğer" };
const TRACE_STATUS: Record<TraceStatus, string> = { pending: "Onay bekliyor", approved: "Haritada", rejected: "Reddedildi" };
const STATUS = { pending: "Onay bekliyor", approved: "Onaylı", rejected: "Reddedildi" };

function day(iso: string) {
  return formatDate(iso.slice(0, 10));
}

export default function AdminPanel() {
  const router = useRouter();
  const [me, setMe] = useState<SessionUser | null | undefined>(undefined);
  const [tab, setTab] = useState<"uyeler" | "mesajlar" | "izler">("uyeler");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [traceFilter, setTraceFilter] = useState<"pending" | "all">("pending");
  const [err, setErr] = useState<string>();

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u: SessionUser | null) => {
        if (!u) router.replace("/giris?next=/panel");
        else if (!u.roles.includes("Admin")) router.replace("/hesap");
        else setMe(u);
      })
      .catch(() => router.replace("/giris?next=/panel"));
  }, [router]);

  const loadUsers = useCallback(async () => {
    const r = await fetch(`/api/bs/admin/users${filter === "pending" ? "?status=pending" : ""}`, { cache: "no-store" });
    if (r.ok) setUsers(await r.json());
    else setErr("Üyeler alınamadı.");
  }, [filter]);

  const loadMsgs = useCallback(async () => {
    const r = await fetch("/api/bs/messages", { cache: "no-store" });
    if (r.ok) setMsgs(await r.json());
    else setErr("Mesajlar alınamadı.");
  }, []);

  const loadTraces = useCallback(async () => {
    const r = await fetch(`/api/bs/traces/all${traceFilter === "pending" ? "?status=pending" : ""}`, { cache: "no-store" });
    if (r.ok) setTraces(await r.json());
    else setErr("İzler alınamadı.");
  }, [traceFilter]);

  useEffect(() => {
    if (!me) return;
    setErr(undefined);
    if (tab === "uyeler") loadUsers();
    else if (tab === "mesajlar") loadMsgs();
    else loadTraces();
  }, [me, tab, loadUsers, loadMsgs, loadTraces]);

  async function patchUser(id: string, body: Partial<{ status: string; adminNote: string; isAdmin: boolean }>) {
    const r = await fetch(`/api/bs/admin/users/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) loadUsers();
    else setErr("Güncellenemedi.");
  }

  async function patchMsg(id: string, body: Partial<{ isRead: boolean; note: string }>) {
    const r = await fetch(`/api/bs/messages/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) loadMsgs();
    else setErr("Güncellenemedi.");
  }

  async function reviewTrace(id: string, body: Partial<{ status: TraceStatus; reviewNote: string }>) {
    const r = await fetch(`/api/bs/traces/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) loadTraces();
    else setErr("Güncellenemedi.");
  }

  async function deleteTrace(id: string) {
    if (!window.confirm("İz ve fotoğrafı kalıcı olarak silinecek. Emin misin?")) return;
    const r = await fetch(`/api/bs/traces/${id}`, { method: "DELETE" });
    if (r.ok) loadTraces();
    else setErr("Silinemedi.");
  }

  if (!me) return <div className="authpage"><p className="hero__lead">Yükleniyor…</p></div>;

  return (
    <div className="panel">
      <div className="panel__head">
        <h1>Yönetim</h1>
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "uyeler"} className={`tab${tab === "uyeler" ? " tab--on" : ""}`} onClick={() => setTab("uyeler")}>Üyeler</button>
          <button type="button" role="tab" aria-selected={tab === "mesajlar"} className={`tab${tab === "mesajlar" ? " tab--on" : ""}`} onClick={() => setTab("mesajlar")}>Mesajlar</button>
          <button type="button" role="tab" aria-selected={tab === "izler"} className={`tab${tab === "izler" ? " tab--on" : ""}`} onClick={() => setTab("izler")}>İzler</button>
        </div>
      </div>

      {err && <div className="form__status form__status--err" role="alert">{err}</div>}

      {tab === "uyeler" && (
        <section>
          <div className="panel__bar">
            <label className="check">
              <input type="checkbox" checked={filter === "pending"} onChange={(e) => setFilter(e.target.checked ? "pending" : "all")} />
              <span>Yalnız onay bekleyenler</span>
            </label>
            <span className="panel__count">{users.length} kayıt</span>
          </div>
          {users.length === 0 ? (
            <div className="empty">{filter === "pending" ? "Onay bekleyen üye yok." : "Henüz üye yok."}</div>
          ) : (
            <ul className="rows">
              {users.map((u) => (
                <li key={u.id} className="row">
                  <div className="row__main">
                    <b>{u.fullName}</b>
                    <span className="row__sub">{u.email}{u.phone ? ` · ${u.phone}` : ""} · {day(u.createdAt)}</span>
                    {u.adminNote && <span className="row__note">{u.adminNote}</span>}
                  </div>
                  <div className="row__side">
                    <span className={`badge badge--${u.status === "approved" ? "ok" : u.status === "rejected" ? "bad" : "pending"}`}>{STATUS[u.status]}</span>
                    {u.roles.includes("Admin") && <span className="badge">Yönetici</span>}
                  </div>
                  <div className="row__actions">
                    {u.status !== "approved" && <button type="button" className="btn btn--primary btn--sm" onClick={() => patchUser(u.id, { status: "approved" })}>Onayla</button>}
                    {u.status !== "rejected" && <button type="button" className="btn btn--ghost btn--sm" onClick={() => patchUser(u.id, { status: "rejected" })}>Reddet</button>}
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => { const n = window.prompt("Not", u.adminNote ?? ""); if (n !== null) patchUser(u.id, { adminNote: n }); }}>Not</button>
                    {u.id !== me.id && (
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => patchUser(u.id, { isAdmin: !u.roles.includes("Admin") })}>
                        {u.roles.includes("Admin") ? "Yöneticiliği al" : "Yönetici yap"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "mesajlar" && (
        <section>
          <div className="panel__bar"><span className="panel__count">{msgs.filter((m) => !m.isRead).length} okunmamış · {msgs.length} toplam</span></div>
          {msgs.length === 0 ? (
            <div className="empty">Henüz mesaj yok.</div>
          ) : (
            <ul className="rows">
              {msgs.map((m) => (
                <li key={m.id} className={`row${m.isRead ? " row--read" : ""}`}>
                  <div className="row__main">
                    <b>{m.name} <span className="badge">{KIND[m.kind]}</span></b>
                    <span className="row__sub">{m.email}{m.phone ? ` · ${m.phone}` : ""} · {day(m.createdAt)}</span>
                    <p className="row__msg">{m.message}</p>
                    {m.latitude != null && m.longitude != null && (
                      <a href={`https://www.openstreetmap.org/?mlat=${m.latitude}&mlon=${m.longitude}#map=17/${m.latitude}/${m.longitude}`} target="_blank" rel="noopener noreferrer" title="Konumu haritada aç">
                        {m.latitude.toFixed(4)}, {m.longitude.toFixed(4)}
                      </a>
                    )}
                    {m.note && <span className="row__note">{m.note}</span>}
                  </div>
                  <div className="row__actions">
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => patchMsg(m.id, { isRead: !m.isRead })}>{m.isRead ? "Okunmadı yap" : "Okundu"}</button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => { const n = window.prompt("Not", m.note ?? ""); if (n !== null) patchMsg(m.id, { note: n }); }}>Not</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "izler" && (
        <section>
          <div className="panel__bar">
            <label className="check">
              <input type="checkbox" checked={traceFilter === "pending"} onChange={(e) => setTraceFilter(e.target.checked ? "pending" : "all")} />
              <span>Yalnız onay bekleyenler</span>
            </label>
            <span className="panel__count">{traces.length} iz</span>
          </div>
          {traces.length === 0 ? (
            <div className="empty">{traceFilter === "pending" ? "Onay bekleyen iz yok." : "Henüz iz bırakılmadı."}</div>
          ) : (
            <ul className="rows">
              {traces.map((t) => (
                <li key={t.id} className={`row row--trace${t.status !== "pending" ? " row--read" : ""}`}>
                  <div className="row__main">
                    <a href={t.photoUrl} target="_blank" rel="noopener noreferrer" title="Fotoğrafı büyük aç">
                      {/* eslint-disable-next-line @next/next/no-img-element -- API alanından gelen fotoğraf */}
                      <img className="row__thumb" src={t.photoUrl} alt={`İz fotoğrafı: ${TRACE_KIND[t.kind]}`} loading="lazy" />
                    </a>
                    <div>
                      <b>{TRACE_KIND[t.kind]} <span className={`badge badge--${t.status === "approved" ? "ok" : t.status === "rejected" ? "bad" : "pending"}`}>{TRACE_STATUS[t.status]}</span></b>
                      <span className="row__sub">
                        {day(t.createdAt)}
                        {t.accuracyM != null && <> · ±{Math.round(t.accuracyM)} m</>}
                        {" · "}
                        <a href={`https://www.openstreetmap.org/?mlat=${t.coords[0]}&mlon=${t.coords[1]}#map=18/${t.coords[0]}/${t.coords[1]}`} target="_blank" rel="noopener noreferrer" title="Konumu haritada aç">
                          {t.coords[0].toFixed(5)}, {t.coords[1].toFixed(5)}
                        </a>
                      </span>
                      {t.note && <p className="row__msg">{t.note}</p>}
                      {t.reviewNote && <span className="row__note">{t.reviewNote}</span>}
                    </div>
                  </div>
                  <div className="row__actions">
                    {t.status !== "approved" && <button type="button" className="btn btn--primary btn--sm" onClick={() => reviewTrace(t.id, { status: "approved" })}>Onayla</button>}
                    {t.status !== "rejected" && <button type="button" className="btn btn--ghost btn--sm" onClick={() => reviewTrace(t.id, { status: "rejected" })}>Reddet</button>}
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => { const n = window.prompt("Not", t.reviewNote ?? ""); if (n !== null) reviewTrace(t.id, { reviewNote: n }); }}>Not</button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => deleteTrace(t.id)}>Sil</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
