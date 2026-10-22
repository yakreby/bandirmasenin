"use cache";

import { cacheLife } from "next/cache";
import type { Spot, Sponsor, Trace } from "./types";
import { getSpots as localSpots, SPONSORS as localSponsors } from "./content";

/**
 * Veri katmanı. Sayfalar yalnızca bu dosyayı kullanır.
 *
 * - `API_URL` tanımlı DEĞİLSE (geliştirme, API'siz önizleme): repodaki `content/` JSON'u.
 * - `API_URL` tanımlıysa: yalnızca API. API düşerse ÖRNEK VERİYE DÜŞÜLMEZ; `error: true` döner ve
 *   arayüz bunu açıkça söyler. Ziyaretçi gerçek bir kesintiyi örnek çalışma sanmamalı.
 */

const API = process.env.API_URL?.replace(/\/$/, "");

export interface DataResult<T> {
  data: T;
  source: "api" | "local";
  error: boolean;
}

async function fromApi<T>(path: string): Promise<T> {
  const r = await fetch(`${API}${path}`, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${path}`);
  return (await r.json()) as T;
}

async function load<T>(path: string, local: () => T, empty: T): Promise<DataResult<T>> {
  if (!API) {
    cacheLife("minutes");
    return { data: local(), source: "local", error: false };
  }
  try {
    const data = await fromApi<T>(path);
    cacheLife("minutes");
    return { data, source: "api", error: false };
  } catch (err) {
    console.error(`[data] API hatası (${path}); örnek veriye DÜŞÜLMEDİ.`, err);
    cacheLife("seconds"); // hata kısa süre önbellekte kalsın, API dönünce hemen toparlasın
    return { data: empty, source: "api", error: true };
  }
}

export async function fetchSpotsResult(): Promise<DataResult<Spot[]>> {
  return load<Spot[]>("/api/spots", localSpots, []);
}

export async function fetchSpots(): Promise<Spot[]> {
  return (await fetchSpotsResult()).data;
}

export async function fetchSpotResult(slug: string): Promise<DataResult<Spot | undefined>> {
  const r = await fetchSpotsResult();
  return { data: r.data.find((s) => s.slug === slug), source: r.source, error: r.error };
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  return (await load<Sponsor[]>("/api/sponsors", () => localSponsors, [])).data;
}

/** Onaylı gönüllü izleri (haritada küçük turuncu noktalar). API yoksa boş; yerel içerikte iz yok. */
export async function fetchTraces(): Promise<Trace[]> {
  return (await load<Trace[]>("/api/traces", () => [], [])).data;
}
