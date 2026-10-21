"use cache";

import { cacheLife } from "next/cache";
import type { Spot, Sponsor } from "./types";
import { getSpots as localSpots, SPONSORS as localSponsors } from "./content";

/**
 * Veri katmanı. `API_URL` tanımlıysa .NET API'den okur, yoksa (veya API düşükse)
 * repodaki `content/` JSON'una düşer. Sayfalar yalnızca bu dosyayı kullanır.
 */

const API = process.env.API_URL?.replace(/\/$/, "");

async function fromApi<T>(path: string): Promise<T | undefined> {
  if (!API) return undefined;
  try {
    const r = await fetch(`${API}${path}`, { headers: { accept: "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as T;
  } catch (err) {
    console.warn(`[data] API erişilemedi (${path}); yerel içerik kullanılıyor.`, err);
    return undefined;
  }
}

export async function fetchSpots(): Promise<Spot[]> {
  cacheLife("minutes");
  return (await fromApi<Spot[]>("/api/spots")) ?? localSpots();
}

export async function fetchSpot(slug: string): Promise<Spot | undefined> {
  cacheLife("minutes");
  const spots = await fetchSpots();
  return spots.find((s) => s.slug === slug);
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  cacheLife("minutes");
  return (await fromApi<Sponsor[]>("/api/sponsors")) ?? localSponsors;
}
