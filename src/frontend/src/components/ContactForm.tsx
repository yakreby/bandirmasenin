"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Kind = "katilim" | "nokta_oneri" | "destek" | "diger";

const KINDS: { value: Kind; label: string }[] = [
  { value: "katilim", label: "Pazar temizliğine katılmak istiyorum" },
  { value: "nokta_oneri", label: "Kirli bir nokta önermek istiyorum" },
  { value: "destek", label: "Destekçi olmak istiyoruz" },
  { value: "diger", label: "Başka bir konu" },
];

const FROM_QUERY: Record<string, Kind> = { katilim: "katilim", nokta: "nokta_oneri", destek: "destek" };

export default function ContactForm({ email }: { email: string }) {
  const params = useSearchParams();
  const initial = FROM_QUERY[params.get("konu") ?? ""] ?? "katilim";

  const [kind, setKind] = useState<Kind>(initial);
  const [state, setState] = useState<{ status: "idle" | "sending" | "ok" | "err"; msg?: string }>({ status: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const lat = fd.get("lat")?.toString().trim();
    const lng = fd.get("lng")?.toString().trim();
    const payload = {
      kind,
      name: fd.get("name")?.toString().trim(),
      email: fd.get("email")?.toString().trim(),
      phone: fd.get("phone")?.toString().trim() || null,
      message: fd.get("message")?.toString().trim(),
      latitude: lat ? Number(lat.replace(",", ".")) : null,
      longitude: lng ? Number(lng.replace(",", ".")) : null,
      website: fd.get("website")?.toString() ?? "",
    };

    setState({ status: "sending" });
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setState({ status: "ok" });
        form.reset();
        return;
      }
      const p = (await r.json().catch(() => null)) as { error?: string } | null;
      setState({ status: "err", msg: p?.error ?? "Mesaj gönderilemedi." });
    } catch {
      setState({ status: "err", msg: "Bağlantı kurulamadı. Lütfen tekrar deneyin." });
    }
  }

  if (state.status === "ok") {
    return (
      <div className="form__status form__status--ok" role="status">
        Mesajınız alındı. En geç birkaç gün içinde e-postayla dönüş yaparız.
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="kind">Konu</label>
        <select id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="name">Adınız</label>
          <input id="name" name="name" type="text" required maxLength={120} placeholder="Ad Soyad" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" required maxLength={200} placeholder="ornek@eposta.com" autoComplete="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Telefon (isteğe bağlı)</label>
        <input id="phone" name="phone" type="tel" maxLength={40} placeholder="05xx xxx xx xx" autoComplete="tel" />
      </div>

      {kind === "nokta_oneri" && (
        <div className="form__row">
          <div className="field">
            <label htmlFor="lat">Enlem (isteğe bağlı)</label>
            <input id="lat" name="lat" type="text" inputMode="decimal" placeholder="40.3562" />
            <span className="field__hint">Haritada noktaya uzun basınca koordinat görünür.</span>
          </div>
          <div className="field">
            <label htmlFor="lng">Boylam (isteğe bağlı)</label>
            <input id="lng" name="lng" type="text" inputMode="decimal" placeholder="27.9605" />
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="message">Mesajınız</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          placeholder={
            kind === "nokta_oneri"
              ? "Nokta nerede, ne birikmiş, ne zaman gördünüz?"
              : kind === "destek"
                ? "Nasıl katkı vermek istiyorsunuz: ekipman, atık kabulü, bütçe?"
                : "Kendinizden kısaca bahsedin; kaç kişi geleceksiniz?"
          }
        />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Web sitesi</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="check">
        <input id="consent" name="consent" type="checkbox" required />
        <span>
          Mesajımın ve iletişim bilgilerimin yalnızca bana dönüş yapmak amacıyla saklanmasını kabul
          ediyorum.{" "}
          <Link href="/kvkk-aydinlatma" title="KVKK aydınlatma metnini oku" target="_blank">
            Aydınlatma metni
          </Link>
        </span>
      </label>

      {state.status === "err" && (
        <div className="form__status form__status--err" role="alert">
          {state.msg} E-posta: {email}
        </div>
      )}

      <div>
        <button type="submit" className="btn btn--primary" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Gönderiliyor" : "Gönder"}
        </button>
      </div>
    </form>
  );
}
