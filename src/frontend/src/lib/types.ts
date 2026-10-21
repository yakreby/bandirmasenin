/** Bandırma Senin — içerik modeli. İlk sürümde kaynak `content/` altındaki JSON dosyalarıdır. */

export type SpotStatus =
  | "tespit_edildi"
  | "planlandi"
  | "tamamlandi"
  | "yeniden_kontrol_edilecek"
  | "tekrar_kirlendi";

export type SpotKind = "sahil" | "park" | "sokak" | "dere" | "diger";

export type Material = "plastik" | "cam" | "metal" | "kagit" | "organik" | "diger";

export type VisitKind = "temizlik" | "kontrol" | "iyilestirme";

export interface Weighing {
  material: Material;
  kg: number;
  /** tarti: kantarla ölçüldü · tahmin: göz kararı, raporda ayrı gösterilir */
  method: "tarti" | "tahmin";
}

export interface Visit {
  date: string; // YYYY-MM-DD
  kind: VisitKind;
  volunteers: number;
  team?: string;
  photos?: { before?: string; after?: string };
  weighings?: Weighing[];
  /** Atığın teslim edildiği kurum veya tesis */
  deliveredTo?: string;
  notes?: string;
}

export interface Recheck {
  date: string;
  result: "temiz" | "kismen" | "tekrar_kirlendi";
  note?: string;
  photo?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  url?: string;
  /** Nasıl katkı verdi: ekipman, atık kabulü, bütçe… */
  contribution?: string;
}

export interface Spot {
  slug: string;
  title: string;
  city: string; // "bandirma" — ileride başka şehirler
  district: string; // mahalle / mevkii
  kind: SpotKind;
  coords: [number, number]; // [lat, lng]
  status: SpotStatus;
  summary: string;
  /** Bu noktanın periyodik kontrolünü üstlenen kişi/grup */
  adoptedBy?: string;
  sponsorIds?: string[];
  recheckDue?: string;
  recheck?: Recheck;
  visits: Visit[];
  /** true ise arayüzde "örnek kayıt" damgası basılır, istatistiklere girmez */
  demo?: boolean;
}

export interface SiteContent {
  name: string;
  tagline: string;
  city: { name: string; center: [number, number]; zoom: number };
  contactEmail: string;
}
