import type { Material, SpotKind, SpotStatus, TraceKind } from "./types";

export const STATUS: Record<SpotStatus, { label: string; short: string; color: string }> = {
  tespit_edildi: { label: "Tespit edildi", short: "Tespit", color: "var(--c-slate)" },
  planlandi: { label: "Planlandı", short: "Planlı", color: "var(--c-amber)" },
  tamamlandi: { label: "Temizlendi", short: "Temiz", color: "var(--c-kelp)" },
  yeniden_kontrol_edilecek: { label: "Kontrol bekliyor", short: "Kontrol", color: "var(--c-sea)" },
  tekrar_kirlendi: { label: "Yeniden kirlendi", short: "Kirlendi", color: "var(--c-rust)" },
};

export const STATUS_ORDER: SpotStatus[] = [
  "tespit_edildi",
  "planlandi",
  "tamamlandi",
  "yeniden_kontrol_edilecek",
  "tekrar_kirlendi",
];

export const MATERIAL: Record<Material, string> = {
  plastik: "Plastik",
  cam: "Cam",
  metal: "Metal",
  kagit: "Kağıt ve karton",
  organik: "Organik",
  diger: "Diğer",
};

export const KIND: Record<SpotKind, string> = {
  sahil: "Sahil",
  park: "Park",
  sokak: "Sokak",
  dere: "Dere kenarı",
  diger: "Diğer",
};

export const TRACE_KIND: Record<TraceKind, string> = {
  karisik: "Karışık çöp",
  plastik: "Plastik",
  cam: "Cam",
  moloz: "Moloz, inşaat atığı",
  tehlikeli: "Tehlikeli atık",
  diger: "Diğer",
};

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatKg(kg: number): string {
  return kg.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
}
