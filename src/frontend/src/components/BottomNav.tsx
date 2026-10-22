"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, ListChecks, HandHeart, MessageSquare, PenLine } from "lucide-react";

const ITEMS = [
  { href: "/#harita", label: "Harita", title: "Çalışma haritası", icon: Map, match: "/" },
  { href: "/#calismalar", label: "Çalışmalar", title: "Çalışma kayıtları", icon: ListChecks, match: "/nokta" },
  { href: "/iz-birak", label: "İz bırak", title: "Gördüğün çöpü fotoğrafla ve bildir", icon: PenLine, match: "/iz-birak", main: true },
  { href: "/katil", label: "Katıl", title: "Pazar temizliğine katıl", icon: HandHeart, match: "/katil" },
  { href: "/iletisim", label: "Yazın", title: "Bize yazın", icon: MessageSquare, match: "/iletisim" },
];

/** Mobilde alt gezinme çubuğu: yüzen, köşeleri yuvarlak; ortada yükseltilmiş "İz bırak". Masaüstünde gizli. */
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bnav" aria-label="Hızlı menü">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const active = it.match === "/" ? pathname === "/" : pathname.startsWith(it.match);
        const cls = ["bnav__i", it.main ? "bnav__i--main" : "", active ? "bnav__i--on" : ""].filter(Boolean).join(" ");
        return (
          <Link key={it.href} href={it.href} title={it.title} className={cls}>
            <span className="bnav__ico">
              <Icon size={it.main ? 22 : 20} aria-hidden />
            </span>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
