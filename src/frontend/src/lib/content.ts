import type { Material, Spot, SiteContent, Sponsor } from "./types";
import site from "../../content/site.json";
import sponsors from "../../content/sponsors.json";
import spotSahil from "../../content/spots/sahil-yuruyus-yolu.json";
import spotPark from "../../content/spots/livatya-parki.json";
import spotDere from "../../content/spots/edincik-yolu-dere-kenari.json";

/** Yeni bir nokta eklerken: content/spots/<slug>.json oluştur, buraya import et, listeye ekle. */
const SPOTS: Spot[] = [spotSahil, spotPark, spotDere] as Spot[];

export const SITE = site as SiteContent;
export const SPONSORS = sponsors as Sponsor[];

export function getSpots(): Spot[] {
  return [...SPOTS].sort((a, b) => lastDate(b).localeCompare(lastDate(a)));
}

export function getSpot(slug: string): Spot | undefined {
  return SPOTS.find((s) => s.slug === slug);
}

export function getSponsor(id: string): Sponsor | undefined {
  return SPONSORS.find((s) => s.id === id);
}

export function lastDate(spot: Spot): string {
  const dates = spot.visits.map((v) => v.date);
  if (spot.recheck) dates.push(spot.recheck.date);
  return dates.sort().at(-1) ?? "";
}

export interface SpotTotals {
  kg: number;
  kgMeasured: number;
  byMaterial: Partial<Record<Material, number>>;
  volunteers: number;
  cleanups: number;
}

export function spotTotals(spot: Spot): SpotTotals {
  const t: SpotTotals = { kg: 0, kgMeasured: 0, byMaterial: {}, volunteers: 0, cleanups: 0 };
  for (const v of spot.visits) {
    if (v.kind === "temizlik") t.cleanups += 1;
    t.volunteers = Math.max(t.volunteers, v.volunteers);
    for (const w of v.weighings ?? []) {
      t.kg += w.kg;
      if (w.method === "tarti") t.kgMeasured += w.kg;
      t.byMaterial[w.material] = (t.byMaterial[w.material] ?? 0) + w.kg;
    }
  }
  return t;
}

export interface SiteStats {
  spots: number;
  /** Yalnızca kantarla tartılmış kilo. Tahminler resmî toplama girmez. */
  kg: number;
  kgEstimated: number;
  volunteers: number;
  rechecked: number;
  /** Tüm kayıtlar örnek veriyse true — arayüz bunu açıkça söyler */
  demoOnly: boolean;
}

/** Örnek kayıtlar (demo: true) toplamlara girmez. */
export function siteStats(spots: Spot[]): SiteStats {
  const real = spots.filter((s) => !s.demo);
  let kg = 0;
  let kgEstimated = 0;
  let volunteers = 0;
  let rechecked = 0;
  for (const s of real) {
    const t = spotTotals(s);
    kg += t.kgMeasured;
    kgEstimated += t.kg - t.kgMeasured;
    volunteers += t.volunteers;
    if (s.recheck) rechecked += 1;
  }
  return { spots: real.length, kg, kgEstimated, volunteers, rechecked, demoOnly: real.length === 0 };
}

export function heroPhotos(spot: Spot): { before?: string; after?: string } {
  const cleanup = [...spot.visits].reverse().find((v) => v.kind === "temizlik" && v.photos);
  return cleanup?.photos ?? {};
}
