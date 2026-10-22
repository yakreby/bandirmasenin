"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, ListChecks, HandHeart, MessageSquare } from "lucide-react";

const ITEMS = [
  { href: "/#harita", label: "Harita", title: "Çalışma haritası", icon: Map, match: "/" },
  { href: "/#calismalar", label: "Çalışmalar", title: "Çalışma kayıtları", icon: ListChecks, match: "/nokta" },
  { href: "/katil", label: "Katıl", title: "Pazar temizliğine katıl", icon: HandHeart, match: "/katil" },
  { href: "/iletisim", label: "Yazın", title: "Bize yazın", icon: MessageSquare, match: "/iletisim" },
];

/** Mobilde alt gezinme çubuğu: yüzen, köşeleri yuvarlak, kenarlardan boşluklu. Masaüstünde gizli. */
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bnav" aria-label="Hızlı menü">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const active = it.match === "/" ? pathname === "/" : pathname.startsWith(it.match);
        return (
          <Link key={it.href} href={it.href} title={it.title} className={`bnav__i${active ? " bnav__i--on" : ""}`}>
            <Icon size={20} aria-hidden />
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
