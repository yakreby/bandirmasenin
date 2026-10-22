import type { MetadataRoute } from "next";
import { fetchSpots } from "@/lib/data";
import { lastDate } from "@/lib/content";

const BASE = "https://bandirmasenin.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spots = await fetchSpots();
  const pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/katil`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/iz-birak`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/iletisim`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/hakkinda`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/cerez-politikasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/kvkk-aydinlatma`, changeFrequency: "yearly", priority: 0.2 },
  ];
  for (const s of spots) {
    if (s.demo) continue; // örnek kayıtlar arama motoruna gitmez
    const d = lastDate(s);
    pages.push({
      url: `${BASE}/nokta/${s.slug}`,
      lastModified: d ? new Date(d) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  return pages;
}
