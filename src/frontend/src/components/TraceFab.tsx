"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine } from "lucide-react";

/** Masaüstünde "yukarı çık"ın üstünde duran İz bırak düğmesi. Mobilde alt menünün orta düğmesi aynı işi yapar. */
export default function TraceFab() {
  const pathname = usePathname();
  if (pathname === "/iz-birak") return null;
  return (
    <Link href="/iz-birak" className="trace-fab" title="İz bırak: gördüğün çöpü fotoğrafla ve konumla bildir">
      <PenLine size={18} aria-hidden />
      <span>İz bırak</span>
    </Link>
  );
}
