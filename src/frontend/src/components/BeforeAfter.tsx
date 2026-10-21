"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Önce/sonra kaydırıcısı. Erişilebilirlik: görünmez bir range input tüm alanı kaplar,
 * klavye ve dokunmayla çalışır; görsel kısım yalnızca onun değerini yansıtır.
 */
export default function BeforeAfter({
  before,
  after,
  title,
}: {
  before?: string;
  after?: string;
  title: string;
}) {
  const [split, setSplit] = useState(50);

  if (!before || !after) {
    const only = before ?? after;
    if (!only) return null;
    return (
      <div className="ba">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba__single" src={only} alt={`${title}, ${before ? "önce" : "sonra"}`} />
        <span className="ba__lbl ba__lbl--b">{before ? "Önce" : "Sonra"}</span>
      </div>
    );
  }

  return (
    <div className="ba" style={{ "--split": `${split}%` } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={before} alt={`${title}, temizlikten önce`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ba__after" src={after} alt={`${title}, temizlikten sonra`} />
      <span className="ba__lbl ba__lbl--b">Önce</span>
      <span className="ba__lbl ba__lbl--a">Sonra</span>
      <div className="ba__bar" />
      <div className="ba__knob" aria-hidden>
        <ChevronsLeftRight size={20} />
      </div>
      <input
        className="ba__range"
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label="Önce ve sonra görüntüsü arasında kaydır"
      />
    </div>
  );
}
