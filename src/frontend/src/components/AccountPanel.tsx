"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import type { SessionUser } from "./AuthMenu";

const STATUS = {
  pending: { label: "Onay bekliyor", cls: "badge--pending", text: "Kaydınız bir yöneticinin onayını bekliyor. Onaylanınca bu sayfada WhatsApp grubunun bağlantısı ve çalışma davetleri görünür." },
  approved: { label: "Onaylı üye", cls: "badge--ok", text: "Hoş geldiniz. Pazar çalışmalarının yeri ve saati e-postayla ve gruptan duyurulur." },
  rejected: { label: "Onaylanmadı", cls: "badge--bad", text: "Kaydınız onaylanmadı. Bir yanlışlık olduğunu düşünüyorsanız iletişim sayfasından yazın." },
};

export default function AccountPanel() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) router.replace("/giris?next=/hesap");
        else setUser(u);
      })
      .catch(() => router.replace("/giris?next=/hesap"));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    setMsg({});
    const r = await fetch("/api/bs/auth/change-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword: fd.get("current"), newPassword: fd.get("next") }),
    });
    if (r.ok) {
      setMsg({ ok: "Şifreniz değişti. Güvenlik için tekrar giriş yapın." });
      form.reset();
      setTimeout(logout, 1500);
    } else {
      const p = (await r.json().catch(() => null)) as { detail?: string; errors?: Record<string, string[]> } | null;
      setMsg({ err: p?.errors ? Object.values(p.errors).flat()[0] : (p?.detail ?? "Şifre değiştirilemedi.") });
    }
  }

  if (!user) return <div className="authpage"><p className="hero__lead">Yükleniyor…</p></div>;
  const st = STATUS[user.status];

  return (
    <div className="account">
      <section>
        <h1>Merhaba, {user.fullName.split(" ")[0]}.</h1>
        <div className="detail__meta">
          <span className={`badge ${st.cls}`}>{st.label}</span>
          <span>{user.email}</span>
        </div>
        <p className="hero__lead">{st.text}</p>

        {user.status === "approved" && user.whatsAppInviteUrl && (
          <a href={user.whatsAppInviteUrl} className="btn btn--primary wa" target="_blank" rel="noopener noreferrer" title="WhatsApp grubuna katıl">
            <MessageCircle size={18} aria-hidden />
            WhatsApp grubuna katıl
          </a>
        )}
      </section>

      <aside className="contact__aside">
        <div className="box">
          <h3>Şifre değiştir</h3>
          <form className="form form--tight" onSubmit={changePassword}>
            <div className="field">
              <label htmlFor="current">Mevcut şifre</label>
              <input id="current" name="current" type="password" required placeholder="Mevcut şifreniz" autoComplete="current-password" />
            </div>
            <div className="field">
              <label htmlFor="next">Yeni şifre</label>
              <input id="next" name="next" type="password" required minLength={8} placeholder="En az 8 karakter" autoComplete="new-password" />
            </div>
            {msg.ok && <div className="form__status form__status--ok">{msg.ok}</div>}
            {msg.err && <div className="form__status form__status--err">{msg.err}</div>}
            <div>
              <button type="submit" className="btn btn--ghost">Kaydet</button>
            </div>
          </form>
        </div>
        <div className="box">
          <h3>Oturum</h3>
          <p>Bu cihazdan çıkış yapmak için:</p>
          <p>
            <button type="button" className="btn btn--ghost" onClick={logout}>Çıkış yap</button>
          </p>
        </div>
      </aside>
    </div>
  );
}
