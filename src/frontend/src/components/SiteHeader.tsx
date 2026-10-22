"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/#harita", label: "Harita", title: "Çalışma haritasına git" },
  { href: "/#calismalar", label: "Çalışmalar", title: "Tüm çalışma kayıtları" },
  { href: "/katil", label: "Katıl", title: "Pazar temizliğine katıl" },
  { href: "/hakkinda", label: "Hakkında", title: "Bandırma Senin nedir" },
  { href: "/iletisim", label: "İletişim", title: "Bize yazın" },
];

export default function SiteHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Link href="/" className="brand" title="Ana sayfa">
          <Logo />
          <span>{name}</span>
        </Link>
        <nav className="nav" aria-label="Site">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} title={l.title}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="offcanvas"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`off${open ? " off--open" : ""}`} id="offcanvas" aria-hidden={!open}>
        <button
          type="button"
          className="off__scrim"
          aria-label="Menüyü kapat"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <nav className="off__panel" aria-label="Mobil menü">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} title={l.title} tabIndex={open ? 0 : -1}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
