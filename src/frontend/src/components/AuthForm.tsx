"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import GoogleButton from "./GoogleButton";

/** Giriş ve kayıt formu tek bileşen; mode belirler. Başarıda hesap sayfasına (ya da ?next=) gider. */
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/hesap";
  const [state, setState] = useState<{ busy: boolean; err?: string }>({ busy: false });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload =
      mode === "login"
        ? { email: fd.get("email"), password: fd.get("password") }
        : {
            fullName: fd.get("fullName"),
            email: fd.get("email"),
            password: fd.get("password"),
            phone: fd.get("phone") || null,
            kvkkAccepted: fd.get("kvkk") === "on",
          };

    setState({ busy: true });
    try {
      const r = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        router.push(next);
        router.refresh();
        return;
      }
      const p = (await r.json().catch(() => null)) as { error?: string } | null;
      setState({ busy: false, err: p?.error ?? "İşlem başarısız." });
    } catch {
      setState({ busy: false, err: "Bağlantı kurulamadı." });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      {mode === "register" && (
        <div className="field">
          <label htmlFor="fullName">Adınız soyadınız</label>
          <input id="fullName" name="fullName" type="text" required maxLength={120} placeholder="Ad Soyad" autoComplete="name" />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" required maxLength={200} placeholder="ornek@eposta.com" autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={100}
          placeholder={mode === "register" ? "En az 8 karakter" : "Şifreniz"}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />
      </div>
      {mode === "register" && (
        <>
          <div className="field">
            <label htmlFor="phone">Telefon (isteğe bağlı)</label>
            <input id="phone" name="phone" type="tel" maxLength={40} placeholder="05xx xxx xx xx" autoComplete="tel" />
            <span className="field__hint">Pazar sabahı yer değişirse kısa mesajla haber vermek için.</span>
          </div>
          <label className="check">
            <input id="kvkk" name="kvkk" type="checkbox" required />
            <span>
              Kişisel verilerimin üyelik ve çalışma duyuruları için işlenmesini kabul ediyorum.{" "}
              <Link href="/kvkk-aydinlatma" title="KVKK aydınlatma metnini oku" target="_blank">
                Aydınlatma metni
              </Link>
            </span>
          </label>
        </>
      )}

      {state.err && (
        <div className="form__status form__status--err" role="alert">
          {state.err}
        </div>
      )}

      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={state.busy}>
          {mode === "login" ? <LogIn size={18} aria-hidden /> : <UserPlus size={18} aria-hidden />}
          {state.busy ? "Bekleyin" : mode === "login" ? "Giriş yap" : "Üye ol"}
        </button>
        {mode === "login" ? (
          <Link href="/kayit" title="Üye ol">
            Hesabınız yok mu? Üye olun
          </Link>
        ) : (
          <Link href="/giris" title="Giriş yap">
            Zaten üye misiniz? Giriş yapın
          </Link>
        )}
      </div>
      <GoogleButton next={next} />
    </form>
  );
}
