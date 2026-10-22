"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import AuthMenu from "./AuthMenu";

const LINKS = [
  { href: "/#harita", label: "Harita", title: "Çalışma haritasına git" },
  { href: "/#calismalar", label: "Çalışmalar", title: "Tüm çalışma kayıtları" },
  { href: "/katil", label: "Katıl", title: "Pazar temizliğine katıl" },
  { href: "/hakkinda", label: "Hakkında", title: "Bandırma Senin nedir" },
  { href: "/iletisim", label: "İletişim", title: "Bize yazın" },
];

export default function SiteHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const overHero = pathname === "/"; // yalnız ana sayfada hero'nun üstüne şeffaf biner

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /* Offcanvas body'ye portal'lanır: header'daki backdrop-filter, fixed çocukları kendi kutusuna hapseder. */
  const offcanvas = (
    <div className={`off${open ? " off--open" : ""}`} id="offcanvas" aria-hidden={!open}>
      <button
        type="button"
        className="off__scrim"
        aria-label="Menüyü kapat"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <nav className="off__panel" aria-label="Mobil menü">
        <div className="off__head">
          <span className="brand">
            <Logo size={40} />
            {name}
          </span>
          <button type="button" className="burger" aria-label="Menüyü kapat" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} title={l.title} tabIndex={open ? 0 : -1}>
            {l.label}
          </Link>
        ))}
        <div className="off__auth">
          <AuthMenu variant="panel" />
        </div>
      </nav>
    </div>
  );

  const cls = ["hdr", overHero && !scrolled ? "hdr--clear" : "", scrolled ? "hdr--scrolled" : ""].filter(Boolean).join(" ");

  return (
    <header className={cls}>
      <div className="wrap hdr__in">
        <Link href="/" className="brand" title="Ana sayfa">
          <Logo size={48} />
          <span>{name}</span>
        </Link>
        <nav className="nav" aria-label="Site">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} title={l.title}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hdr__right">
          <div className="hdr__auth">
            <AuthMenu variant="bar" />
          </div>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="offcanvas"
            aria-label="Menüyü aç"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      {mounted ? createPortal(offcanvas, document.body) : null}
    </header>
  );
}
