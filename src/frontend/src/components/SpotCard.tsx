import Link from "next/link";
import type { Spot } from "@/lib/types";
import { lastDate, spotTotals } from "@/lib/content";
import { formatDate, formatKg } from "@/lib/status";
import StatusBadge from "./StatusBadge";

export default function SpotCard({ spot }: { spot: Spot }) {
  const t = spotTotals(spot);
  const date = lastDate(spot);
  return (
    <Link href={`/nokta/${spot.slug}`} className="card">
      <div className="card__top">
        <StatusBadge status={spot.status} />
        {spot.demo && <span className="stamp">örnek kayıt</span>}
      </div>
      <h3 className="card__t">{spot.title}</h3>
      <div className="card__d">{spot.district}</div>
      <div className="card__row">
        {date && <span>{formatDate(date)}</span>}
        {t.kgMeasured > 0 && (
          <span>
            <b>{formatKg(t.kgMeasured)} kg</b> tartıldı
          </span>
        )}
        {t.kg - t.kgMeasured > 0.05 && <span>+{formatKg(t.kg - t.kgMeasured)} kg tahmin</span>}
        {t.volunteers > 0 && (
          <span>
            <b>{t.volunteers}</b> kişi
          </span>
        )}
      </div>
    </Link>
  );
}
